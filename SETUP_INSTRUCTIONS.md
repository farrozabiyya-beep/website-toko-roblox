# DEV ROBLOX SHOP - Setup Instructions

## Pemasangan & Konfigurasi

### 1. File Logo Gambar
**Status:** Logo placeholder di `/assets/images/logo.jpg` (siap untuk diisi)

Untuk menambahkan logo profil DEV Store:
1. Siapkan gambar logo dalam format JPG/PNG
2. Sesuaikan ukuran ke 200x200px (optimal)
3. Letakkan file dengan nama `logo.jpg` di folder `/assets/images/`
4. Website akan otomatis menampilkan logo di semua halaman

File yang sudah dikonfigurasi untuk logo:
- `index.html`
- `pages/product.html`
- `pages/robux-gamepass.html`
- `pages/robux-instant.html`
- `pages/review.html`
- `pages/contact.html`
- `pages/order.html`
- `pages/premium-upgrade.html`
- `pages/akun-roblox.html`

### 2. Stock System untuk Akun Roblox

Stock system sudah terintegrasi di `pages/akun-roblox.html`. 

**Cara kerja:**
- Jika ada stock (quantity > 0): Menampilkan kartu akun dengan profile, username, harga, deskripsi
- Jika tidak ada stock: Menampilkan pesan "Ups tidak ada stock tersedia"

**Manajemen stock:**
Data stock disimpan di `localStorage` dengan key `robloxAccounts`. Struktur data:

```javascript
[
  {
    id: "akun-001",
    profile: "Akun Roblox Premium",
    username: "namauser123",
    price: 500000,
    description: "Deskripsi akun lengkap",
    stock: 1  // Jumlah stock (0 atau lebih)
  }
]
```

Admin Dashboard di `/pages/admin/dashboard.html` dapat mengatur stock ini.

### 3. Checkout System

**Status:** Checkout sudah terintegrasi penuh di semua product pages

**Fitur:**
- Validasi username via Roblox API
- Tampilan avatar user dari Roblox
- Modal checkout dengan summary order
- Integrasi WhatsApp untuk proses pembayaran
- Simpan order ke localStorage
- Redirect ke halaman pesanan setelah submit

**File-file terkait:**
- `assets/js/product-pages.js` - Logic form dan checkout
- `assets/js/main.js` - Utility dan API calls
- `pages/robux-gamepass.html` - Contoh product page

### 4. Admin Panel

**Lokasi:** `/pages/admin/dashboard.html`

**Akses:**
- Username: `devstore`
- Password: `devstore1230`

**Fitur:**
- Manajemen stock akun Roblox
- Lihat semua orders
- Kelola reviews
- Edit kontak

### 5. Contact Information

Informasi kontak di `pages/contact.html`:
- **WhatsApp:** 0812-1447-7714 (62-812-1447-7714)
- **Telepon:** +62 812-1447-7714

Nomor placeholder di product form tetap menggunakan format generic (0812-3456-7890) untuk contoh.

### 6. API Integration

Website menggunakan Roblox API untuk:

**Username Validation & Avatar:**
```
GET https://api.roblox.com/users/get-by-username?username={USERNAME}
GET https://thumbnails.roblox.com/v1/users/avatar?userIds={USER_ID}&size=420x420&format=Png&isCircular=false
```

### 7. Production Ready Checklist

- ✅ Username validation dengan avatar display
- ✅ Admin panel dengan security
- ✅ Contact numbers correct
- ✅ Stock system untuk akun roblox
- ✅ 13 CSS animations
- ✅ Checkout modal dengan WhatsApp integration
- ✅ Order tracking
- ✅ Review system
- ⏳ Logo image file (siap, tunggu input gambar)

### 8. Testing Before Deployment

1. **Test Username Validation:**
   - Masukkan username Roblox valid
   - Klik tombol "Cek"
   - Verifikasi avatar muncul

2. **Test Checkout:**
   - Isi semua form field
   - Klik "Lanjutkan ke Pembayaran"
   - Verifikasi modal checkout muncul
   - Klik "Lanjutkan ke WhatsApp"
   - Verifikasi order tersimpan dan redirect ke halaman pesanan

3. **Test Admin Panel:**
   - Login dengan credentials di atas
   - Verifikasi bisa lihat dan edit data

4. **Test Stock System:**
   - Buka halaman akun-roblox.html
   - Verifikasi menampilkan akun jika ada stock
   - Verifikasi pesan "Ups tidak ada stock" jika kosong

### 9. Deployment

Website ini adalah **static website** dan dapat di-deploy ke:
- Web hosting shared (cPanel)
- Netlify
- Vercel
- GitHub Pages
- Apache/Nginx server

Cukup upload semua file ke root directory hosting.

### 10. Notes

- Semua data disimpan di browser's localStorage
- Tidak memerlukan server/database khusus
- API calls ke Roblox tidak memerlukan authentication
- WhatsApp integration via Web API

---

**Last Updated:** Desember 2024
**Status:** Production Ready (menunggu logo image)
