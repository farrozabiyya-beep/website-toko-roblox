# DEV ROBLOX SHOP - QUICK START GUIDE

## 🎯 Mulai Menggunakan Website

### 1. Buka Website
```
Halaman Utama: index.html
URL: http://localhost/index.html
```

---

## 👤 Untuk Pelanggan / Pengunjung

### Membeli Robux
1. Klik tombol "Ayo Buat Pesananmu Sekarang" di hero section
2. Pilih produk (Robux Via Gamepass atau Robux Instant)
3. Isi form:
   - **Username Roblox** (klik tombol "Periksa" untuk validasi)
   - **Nomor WhatsApp**
   - **Jumlah Robux**
   - **Metode Pembayaran** (GoPay, DANA, OVO, ShopeePay, QRIS)
   - **Kode Promo** (opsional)
4. Klik "Lanjutkan Checkout"
5. Review pesanan dan klik "Hubungi WhatsApp"
6. Lanjutkan pembayaran via WhatsApp

### Tracking Pesanan
1. Klik "Pesananku" di navbar
2. Cari pesanan berdasarkan:
   - ID Pesanan
   - Username Roblox
   - Nomor WhatsApp
3. Lihat status pesanan (Pending, Completed, Failed)

### Memberikan Review
1. Klik "Review" di navbar
2. Tulis review dan beri rating (1-5 bintang)
3. Klik "Kirim Review"
4. Review akan tersimpan dan bisa dilihat oleh pengunjung lain

### Hubungi Kami
1. Klik "Kontak" di navbar
2. Pilih WhatsApp atau Instagram untuk menghubungi customer service

---

## 🔐 Untuk Admin

### Login ke Admin Panel

**Akses Admin:**
1. Buka: `pages/admin/login.html`
2. Login dengan:
   - Username: `devstore`
   - Password: `devstore1230`
3. Klik "Login"

⚠️ **PENTING:** Ganti password ini di production!

### Admin Dashboard Features

#### 1. Dashboard (Overview)
- Melihat statistik umum:
  - Total Pesanan Pending
  - Total Pesanan Selesai
  - Total Revenue
  - Total Reviews
- Real-time updates

#### 2. Kelola Pesanan
- Lihat semua pesanan customer
- Filter berdasarkan status (Pending/Completed/Failed)
- Cari pesanan berdasarkan ID atau username
- Aksi:
  - **Selesai**: Ubah status menjadi Completed
  - **Hapus**: Hapus pesanan dari database

#### 3. Kelola Stok
- Lihat stok produk
- Tambah stok produk baru:
  - Nama produk
  - Harga
  - Jumlah stok
- Edit dan hapus produk

#### 4. Kelola Promo
- Kelola kode promo
- Tambah promo baru:
  - Kode promo
  - Diskon (%)
  - Tanggal expired
- Promo otomatis expired jika tanggal sudah lewat
- Edit dan hapus promo

#### 5. Metode Pembayaran
- Edit nomor akun untuk setiap metode:
  - GoPay
  - DANA
  - OVO
  - ShopeePay
- Edit nama penerima
- Klik "Simpan Perubahan" untuk update

#### 6. Laporan
- Lihat laporan lengkap:
  - Total pesanan
  - Total revenue
  - Statistik per metode pembayaran
- Download laporan sebagai file TEXT

#### 7. Pengaturan
- Edit nama toko
- Edit deskripsi toko
- Setting lainnya

---

## 🛠️ Untuk Developer / Maintenance

### Struktur Folder

```
website toko roblox/
├── index.html                 # Halaman utama
├── README.md                  # Dokumentasi project
├── UPDATE_LOG.md             # Changelog revisi
├── REVISION_STATUS.txt       # Status revisi
│
├── pages/                     # Halaman-halaman
│   ├── product.html          # Listing produk
│   ├── robux-gamepass.html   # Produk Robux via Gamepass
│   ├── robux-instant.html    # Produk Robux instant
│   ├── premium-upgrade.html  # Upgrade premium
│   ├── review.html           # Halaman review
│   ├── contact.html          # Halaman kontak
│   ├── order.html            # Tracking pesanan
│   ├── akun-roblox.html      # Jual akun Roblox
│   └── admin/                # Admin panel
│       ├── login.html        # Admin login
│       └── dashboard.html    # Admin dashboard
│
├── assets/                    # Asset files
│   ├── css/
│   │   ├── style.css         # Global styles
│   │   ├── product-page.css  # Product page styles
│   │   └── admin.css         # Admin panel styles
│   ├── js/
│   │   ├── main.js           # Main utilities & functions
│   │   ├── product-pages.js  # Product form handling
│   │   └── admin.js          # Admin panel functions
│   └── images/               # Product images (empty)
│
└── update_logos.js           # Script untuk update logo
```

### Membuat Produk Baru

1. **Buat file HTML baru** di `pages/`
2. **Copy template dari** `robux-gamepass.html` atau `robux-instant.html`
3. **Update:**
   - `<title>` - Nama produk
   - `<h1>` - Judul halaman
   - Radio buttons untuk pilihan produk
   - Harga untuk masing-masing pilihan
4. **Link di** `product.html` atau halaman listing

### Modifikasi Styling

- Edit `assets/css/style.css` untuk global styles
- Edit `assets/css/product-page.css` untuk form styles
- Edit `assets/css/admin.css` untuk admin panel

### Menambah Animasi Baru

Semua animasi ada di `style.css`. Contoh menambah animasi baru:

```css
@keyframes myNewAnimation {
    from {
        opacity: 0;
        transform: scale(0.5);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.my-element {
    animation: myNewAnimation 0.5s ease-out;
}
```

### Data Storage (LocalStorage)

Semua data disimpan di browser's LocalStorage:

```javascript
// User Data
localStorage.getItem('userData')

// Cart Data
localStorage.getItem('cartData')

// Orders
localStorage.getItem('orderData')

// Reviews
localStorage.getItem('reviewData')

// Admin Token
localStorage.getItem('adminToken')
```

---

## 🔗 API yang Digunakan

### Roblox API
```
GET https://api.roblox.com/users/get-by-username?username={username}
Mendapatkan info user Roblox
```

### Avatar URL
```
https://www.roblox.com/bust-thumbnails/avatar/150x150?username={username}&isCircular=true
Mendapatkan avatar profil Roblox
```

### WhatsApp API
```
https://wa.me/{phoneNumber}?text={message}
Membuka WhatsApp dengan pesan pre-filled
```

---

## 🐛 Troubleshooting

### Logo tidak muncul
- Pastikan file HTML sudah di-update dengan SVG logo baru
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh halaman

### Username tidak tervalidasi
- Pastikan username valid (3-20 karakter, alphanumeric + underscore)
- Periksa koneksi internet
- Coba username yang sudah terbukti ada di Roblox

### Admin login tidak bisa
- Pastikan password: `devstore1230` (case-sensitive)
- Clear browser cache
- Coba di browser lain

### Pesanan tidak tersimpan
- Periksa LocalStorage tidak penuh
- Clear browser cache dan cookies
- Check browser console untuk error messages

### Animasi tidak smooth
- Update browser ke versi terbaru
- Disable browser extensions yang berat
- Check hardware acceleration di browser settings

---

## 📊 Performance Tips

1. **Untuk gambar produk:**
   - Gunakan format WebP untuk ukuran lebih kecil
   - Compress images sebelum upload
   - Gunakan CDN untuk asset delivery

2. **Untuk animasi:**
   - Animasi sudah GPU-accelerated
   - Reduce particle count di mobile jika lag
   - Use `will-change` CSS untuk optimization

3. **Untuk mobile:**
   - Test di berbagai ukuran layar
   - Enable "Reduce motion" untuk accessibility
   - Optimize font loading

---

## 🚀 Deployment

### Hosting Options
- Netlify (Free)
- Vercel (Free)
- GitHub Pages (Free)
- AWS S3 + CloudFront
- Bluehost / Hostinger (Paid)

### Steps
1. Upload semua file ke hosting
2. Set `index.html` sebagai entry point
3. Configure domain
4. Enable HTTPS
5. Test semua fungsi

### Before Going Live
- ✅ Change admin password
- ✅ Update contact numbers jika perlu
- ✅ Test semua forms
- ✅ Test payment method display
- ✅ Test admin panel
- ✅ Check mobile responsiveness
- ✅ Monitor console errors

---

## 📞 Support

Untuk bantuan atau pertanyaan:
- WhatsApp: +62 812-3456-7890
- Instagram: @devrobloxshop_

---

## 📋 Changelog

**v1.1.0** - 13 November 2025
- Improved Roblox API validation
- Enhanced security
- New SVG logo
- 13 new animations
- Generic contact numbers

**v1.0.0** - Initial Release
- Website launch

---

**Status: PRODUCTION READY** ✓

Selamat menggunakan DEV ROBLOX SHOP!
