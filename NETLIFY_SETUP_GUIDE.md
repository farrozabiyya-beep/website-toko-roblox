# DEV ROBLOX SHOP - Admin Dashboard Setup Guide

## Fitur Baru

### 1. **Admin Dashboard dengan Fetch API**
- File `admin/admin.js` melakukan fetch ke `/.netlify/functions/saveOrder`
- Menampilkan data pesanan dalam tabel
- Jika tidak ada pesanan, tampilkan pesan "Belum ada pesanan"
- Tombol **Refresh** untuk menyegarkan data secara manual
- Fallback ke localStorage jika Netlify API tidak tersedia

### 2. **Statistik Dashboard**
- **Pesanan Hari Ini** - Jumlah pesanan yang dibuat hari ini
- **Produk Paling Populer** - Produk dengan penjualan tertinggi
- **Total Revenue** - Total pendapatan dari semua pesanan
- **Total Pesanan** - Jumlah keseluruhan pesanan

Statistik dihitung otomatis dari data pesanan yang di-fetch.

### 3. **Pencegahan Horizontal Scroll & Swipe**
- Menambahkan `overflow-x: hidden` pada html, body, container, main, dan section
- Menambahkan `touch-action: pan-y` untuk mencegah swipe horizontal
- JavaScript event listeners untuk mencegah gestures

---

## Setup untuk Deployment di Netlify

### Prerequisites
- Akun Netlify (gratis)
- Git repository (GitHub, GitLab, atau Bitbucket)
- Node.js (opsional, untuk testing lokal)

### Langkah 1: Persiapkan Folder Proyek

Struktur folder yang diperlukan:
```
website toko roblox/
├── index.html
├── admin/
│   ├── index.html (login)
│   ├── dashboard.html
│   ├── style.css
│   ├── script.js
│   └── admin.js (BARU)
├── pages/
├── assets/
├── netlify/
│   └── functions/
│       └── saveOrder.js (BARU)
├── netlify.toml (BARU)
└── ... (file lainnya)
```

### Langkah 2: Push ke GitHub

```bash
cd "website toko roblox"

# Initialize git (jika belum)
git init

# Add all files
git add .

# Commit
git commit -m "Add admin dashboard dengan Netlify functions"

# Add remote (sesuaikan dengan repo Anda)
git remote add origin https://github.com/username/repo.git

# Push
git push -u origin main
```

### Langkah 3: Deploy ke Netlify

#### Metode 1: Via Web Dashboard (Termudah)
1. Buka [https://app.netlify.com](https://app.netlify.com)
2. Klik "**New site from Git**"
3. Pilih Git provider (GitHub, GitLab, atau Bitbucket)
4. Authenticate dan pilih repository
5. Di "Build settings":
   - **Build command:** Biarkan kosong atau `echo 'Ready'`
   - **Publish directory:** `.` (root folder) atau biarkan kosong
6. Klik "**Deploy site**"
7. Tunggu proses selesai

#### Metode 2: Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Deploy folder ini
cd "website toko roblox"
netlify deploy --prod
```

### Langkah 4: Verifikasi Deployment

Setelah deployment berhasil:

1. **Test Admin Dashboard**
   - Buka: `https://your-site.netlify.app/admin/`
   - Login dengan credentials:
     - Username: `devrobloxstore`
     - Password: `devstore1230`

2. **Test Netlify Function**
   - Buka console browser (F12)
   - Cek apakah data orders berhasil di-fetch
   - Tombol Refresh harus berfungsi

3. **Test Statistik**
   - Card statistik harus menampilkan data
   - Refresh harus update statistik

---

## Fitur Admin Dashboard

### Data Pesanan
| Kolom | Deskripsi |
|-------|-----------|
| ID Pesanan | Nomor pesanan unik |
| Username | Nama pelanggan |
| Item | Produk yang dipesan |
| Harga | Total harga pesanan |
| Status | Pending/Diproses/Selesai/Dibatalkan |
| WhatsApp | Link ke WhatsApp pelanggan |
| Aksi | Edit/Delete |

### Tombol Aksi
- **Refresh** - Menyegarkan data dari server
- **Tambah Pesanan** - Menambah pesanan baru
- **Edit** - Edit pesanan (icon pensil)
- **Hapus** - Hapus pesanan (icon trash)

---

## API Endpoints

### GET /.netlify/functions/saveOrder
Mengambil semua data pesanan

**Response:**
```json
[
  {
    "id": "ORD-1234567890",
    "username": "John Doe",
    "products": [
      {
        "name": "Robux Gamepass",
        "quantity": 1,
        "price": 50000
      }
    ],
    "totalPrice": 50000,
    "status": "Pending",
    "phone": "6281234567890",
    "createdAt": "2024-11-14T10:30:00Z"
  }
]
```

### POST /.netlify/functions/saveOrder
Menyimpan pesanan baru

**Request Body:**
```json
{
  "username": "John Doe",
  "products": [
    {
      "name": "Robux Gamepass",
      "quantity": 1,
      "price": 50000
    }
  ],
  "totalPrice": 50000,
  "status": "Pending",
  "phone": "6281234567890"
}
```

### DELETE /.netlify/functions/saveOrder?id=ORDER_ID
Menghapus pesanan berdasarkan ID

---

## Troubleshooting

### Problem: "404 Not Found" di admin page
- Pastikan file `admin/dashboard.html` ada
- Cek URL Netlify yang benar
- Clear browser cache (Ctrl+Shift+Delete)

### Problem: Data tidak muncul di tabel
1. Buka Console (F12)
2. Cek apakah ada error saat fetch
3. Jika error "Cannot fetch from /.netlify/functions/saveOrder":
   - Pastikan `netlify.toml` sudah ada
   - Pastikan folder `netlify/functions/saveOrder.js` ada
   - Re-deploy: `git push` lalu tunggu Netlify build

### Problem: Statistik menampilkan "Tidak ada data"
- Pastikan sudah ada pesanan di sistem
- Cek localStorage: buka DevTools > Application > Local Storage
- Jika kosong, tambah pesanan via customer website terlebih dahulu

### Problem: Horizontal scroll masih ada
- Clear browser cache sepenuhnya
- Cek di mobile yang berbeda
- Reload page dengan Ctrl+Shift+R (hard refresh)

---

## Development Lokal (Opsional)

Untuk testing sebelum deploy:

### Dengan Netlify CLI
```bash
# Install dependencies
npm install -g netlify-cli

# Run dev server
netlify dev

# Akses di http://localhost:8888
```

### Tanpa CLI
```bash
# Buka file langsung di browser
open index.html

# Atau gunakan local server (Python)
python3 -m http.server 8000
# Akses di http://localhost:8000
```

**Note:** Netlify Functions hanya tersedia setelah di-deploy ke Netlify, bukan di local.

---

## Backup & Restore Data

### Backup Data dari Netlify
```bash
# Buka console di admin dashboard
const orders = await fetch('/.netlify/functions/saveOrder').then(r => r.json());
console.save(orders, 'orders-backup.json');
```

### Restore Data
```bash
# Upload kembali via API atau manual di tabel admin
```

---

## Security Notes

⚠️ **Important:**
1. Ubah credentials admin di `admin/script.js` sebelum production
2. Gunakan environment variables untuk sensitive data
3. Implement proper authentication (JWT/Session)
4. Add rate limiting pada functions
5. Validate semua input di server

---

## Support

Jika ada pertanyaan atau masalah:
1. Cek error message di browser console
2. Cek Netlify function logs: Dashboard > Functions > saveOrder
3. Lihat dokumentasi: https://docs.netlify.com

---

**Last Updated:** November 2024
**Version:** 1.0
