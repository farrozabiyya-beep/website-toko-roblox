# DEV ROBLOX SHOP - Website Toko Roblox Modern

Website toko online yang menyediakan kebutuhan Roblox dengan sistem pembayaran terintegrasi dan admin panel lengkap.

## 📋 Struktur Folder

```
website toko roblox/
├── index.html                    # Halaman utama
├── pages/
│   ├── product.html             # Daftar semua produk
│   ├── robux-gamepass.html      # Produk Robux Via Gamepass
│   ├── robux-instant.html       # Produk Robux Instant
│   ├── premium-upgrade.html     # Upgrade Premium
│   ├── akun-roblox.html         # Akun Roblox
│   ├── car-driving.html         # Game: Car Driving Indonesia
│   ├── taxi-boss.html           # Game: Taxi Boss
│   ├── steal-brainrot.html      # Game: Steal a Brainrot
│   ├── strongest-battlegrounds.html # Game: Strongest Battlegrounds
│   ├── brookhaven.html          # Game: Brookhaven RP
│   ├── grow-garden.html         # Game: Grow a Garden
│   ├── salon-fiestas.html       # Game: Salon de Fiestas
│   ├── fisch.html               # Game: Fisch
│   ├── blox-fruit.html          # Game: Blox Fruit
│   ├── review.html              # Halaman Review
│   ├── contact.html             # Halaman Kontak
│   ├── order.html               # Cek Pesanan
│   └── admin/
│       ├── login.html           # Login Admin
│       └── dashboard.html       # Dashboard Admin
├── assets/
│   ├── css/
│   │   ├── style.css            # CSS Utama
│   │   ├── product-page.css     # CSS Halaman Produk
│   │   └── admin.css            # CSS Admin Panel
│   ├── js/
│   │   ├── main.js              # JavaScript Utama
│   │   ├── product-pages.js     # Fungsi Halaman Produk
│   │   └── admin.js             # Fungsi Admin Panel
│   └── images/                  # Folder untuk gambar
├── README.md                    # File dokumentasi ini
└── LICENSE
```

## 🎨 Fitur Utama

### Halaman Pelanggan
- ✅ Halaman utama dengan hero section animasi
- ✅ Daftar produk unggulan (4 kategori)
- ✅ Daftar produk dalam game (9 game)
- ✅ Form pemesanan dengan validasi
- ✅ Integrasi WhatsApp untuk konfirmasi pesanan
- ✅ Sistem review dan rating
- ✅ Halaman kontak
- ✅ Cek status pesanan (by ID, Username, atau No. Telepon)
- ✅ Metode pembayaran: Bank, GoPay, DANA, OVO, ShopeePay, QRIS

### Admin Panel
- ✅ Dashboard dengan statistik real-time
- ✅ Manajemen pesanan (lihat, ubah status, hapus)
- ✅ Manajemen stock produk
- ✅ Manajemen kode promo
- ✅ Edit metode pembayaran
- ✅ Generate laporan penjualan
- ✅ Pengaturan toko

## 🚀 Cara Menggunakan

### Akses Website
1. Buka file `index.html` di browser
2. Navigasi menggunakan menu di atas
3. Klik pada produk untuk melihat detail

### Login Admin
1. Masuk ke halaman produk atau klik "Admin Panel" di menu profil
2. Klik "Admin Panel" di modal
3. **Credentials:**
   - Username: `admin`
   - Password: `admin123`
4. Akses dashboard dengan fitur manajemen lengkap

## 🔌 Teknologi

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Data Storage:** LocalStorage (Browser)
- **Icons:** Font Awesome 6.4.0
- **Responsive:** Mobile-first design
- **Animasi:** CSS Custom Animations

## 💳 Metode Pembayaran

Semua metode pembayaran terintegrasi dengan nomor rekening:

```
Bank Transfer    : 0812-1447-7714 (Fa**** Ab****)
GoPay            : 0812-1447-7714
DANA             : 0852-8045-2660 (Tr* Ca*** Nin****)
OVO              : 0812-1447-7714
ShopeePay        : 0812-1447-7714
QRIS             : (Lihat halaman checkout)
```

## 📱 Link Penting

- **WhatsApp Grup:** https://chat.whatsapp.com/GMN3Ydyi8jR6I43LrsmqoA
- **Instagram:** https://www.instagram.com/devrobloxshop_/
- **WhatsApp Owner:** https://wa.me/6281214477714

## 🎯 Fitur Checkout

1. **Validasi Username Roblox** - Otomatis cek ketersediaan dan tampilkan avatar
2. **Pilih Metode Pembayaran** - 5 pilihan metode
3. **Kode Promo** - Support kode promo otomatis
4. **Konfirmasi** - Review detail pesanan sebelum pembayaran
5. **WhatsApp Integration** - Auto-open WhatsApp dengan format pesanan

## 📊 Data Penyimpanan

Website menggunakan LocalStorage untuk menyimpan:

- `userData` - Data user
- `cartData` - Data keranjang
- `orders` - Daftar pesanan
- `reviews` - Review pelanggan
- `stocks` - Stock produk
- `promos` - Kode promo
- `adminToken` - Token admin login

## 🎨 Desain UI/UX

### Warna Utama
- **Primary Color:** #001f3f (Navy Biru Gelap)
- **Secondary Color:** #0047ab (Biru Tengah)
- **Accent Color:** #00bfff (Cyan Terang)
- **Background:** Putih dengan gradient subtle

### Font
- **Font Family:** Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Modern & Clean** - Tidak terlalu klasik

### Animasi
- Hero section dengan particle animations
- Smooth transitions di semua elemen
- Loading states dengan spinner
- Hover effects di cards dan buttons

## 📈 SEO & Performance

- Semantic HTML5
- Meta tags yang tepat
- Responsive design
- Fast loading dengan CSS optimization
- LocalStorage untuk caching

## ⚙️ Konfigurasi

### Mengubah Nomor Telepon
Edit di `assets/js/main.js` dan setiap halaman produk:
```javascript
https://wa.me/6281214477714
```

### Mengubah Informasi Toko
Gunakan Admin Panel → Pengaturan

### Menambah Promo
1. Login admin
2. Klik "Kode Promo"
3. Isi form dan tambahkan

## 🔒 Keamanan

**Catatan:** Website ini menggunakan demo credentials untuk admin.
Untuk production, implementasikan:
- Backend authentication proper
- Password hashing (bcrypt)
- JWT tokens
- HTTPS encryption
- Database (MySQL, MongoDB, etc.)

## 📝 Lisensi

© 2024 DEV ROBLOX SHOP. All Rights Reserved.

## 🤝 Support

Untuk pertanyaan atau support:
- WhatsApp: https://wa.me/6281214477714
- Instagram: @devrobloxshop_
- Email: (dapat ditambahkan)

---

**Status:** Development Ready ✅
**Last Update:** November 2024
**Version:** 1.0

