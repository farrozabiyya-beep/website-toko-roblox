# 📚 PANDUAN FITUR BARU - ADMIN PANEL

Dokumentasi lengkap untuk 3 fitur tambahan yang telah diimplementasikan di Admin Panel Dev Roblox Shop.

---

## 1️⃣ FITUR FLASH SALE

### 📌 Lokasi Menu
- Login Admin Panel → Dashboard
- Sidebar → **Flash Sale** (ikon 🔥)

### ✨ Fitur Utama
Admin dapat membuat flash sale dengan:
- **Pilih Produk**: Dari 6 produk yang tersedia
- **Harga Normal**: Harga asli produk
- **Harga Flash Sale**: Harga spesial/diskon
- **Waktu Mulai**: Tanggal dan jam dimulainya flash sale
- **Waktu Berakhir**: Tanggal dan jam berakhirnya flash sale

### 🎯 Cara Menggunakan

1. **Membuat Flash Sale Baru:**
   - Klik tombol **"+ Buat Flash Sale"** (hijau)
   - Isi form dengan data produk dan harga
   - Tentukan waktu mulai dan berakhir
   - Klik **"Simpan"**

2. **Mengedit Flash Sale:**
   - Di tabel Flash Sale, klik tombol **"Edit"** (biru)
   - Ubah data yang diperlukan
   - Klik **"Simpan"**

3. **Menghapus Flash Sale:**
   - Klik tombol **"Hapus"** (merah)
   - Konfirmasi penghapusan
   - Flash sale akan dihapus dari daftar

### 📊 Status Flash Sale
Setiap flash sale memiliki status:
- **Mendatang** (Abu-abu): Flash sale belum dimulai
- **Aktif** (Hijau): Flash sale sedang berlangsung
- **Selesai** (Merah): Flash sale telah berakhir

### 🌐 Tampilan di Website Pelanggan
Ketika flash sale aktif, produk akan menampilkan:
- **Label 🔥 Flash Sale** di sudut kiri atas
- **Countdown Timer** di sudut kanan bawah (⏱️ format: jam/menit/detik)
- Harga flash sale akan ditampilkan

### 🔄 Sinkronisasi Real-time
- Data flash sale tersimpan di localStorage
- Otomatis sinkron ke website pelanggan
- Countdown terupdate setiap detik

---

## 2️⃣ FITUR ATUR BUKA/TUTUP WEBSITE

### 📌 Lokasi Menu
- Login Admin Panel → Dashboard
- Sidebar → **Buka/Tutup** (ikon toggle)

### ✨ Fitur Utama
Admin dapat:
- **Toggle Status Website**: Membuka atau menutup website
- **Status Real-time**: Pelanggan akan melihat perubahan secara instant
- **Pop-up Otomatis**: Jika website ditutup, pelanggan melihat notifikasi

### 🎯 Cara Menggunakan

1. **Membuka Website:**
   - Klik tombol **"🟢 Buka Website"** (biru)
   - Status berubah menjadi "🟢 Sedang Buka"
   - Pelanggan dapat mengakses semua halaman

2. **Menutup Website:**
   - Klik tombol **"🔴 Tutup Website"** (merah)
   - Status berubah menjadi "🔴 Sedang Tutup"
   - Pelanggan akan melihat pop-up dengan pesan:
     ```
     Maaf, Toko Sedang Tutup
     Silakan kembali nanti untuk berbelanja.
     ```

### 🎨 Tampilan Admin Panel
Status box berubah warna:
- **Buka**: Gradient biru-ungu (🟢 Sedang Buka)
- **Tutup**: Gradient merah-pink (🔴 Sedang Tutup)

### 🌐 Tampilan di Website Pelanggan
Jika website ditutup:
- Pop-up overlay gelap muncul
- Pesan "Maaf, Toko Sedang Tutup" ditampilkan
- Button "Kembali ke Beranda"
- Pelanggan tidak bisa mengakses halaman lain

### 🔄 Sinkronisasi Real-time
- Status disimpan di localStorage dengan key: `websiteStatus`
- Otomatis terdeteksi oleh website pelanggan
- Perubahan instant tanpa reload

---

## 3️⃣ FITUR CEK STOK PRODUK

### 📌 Lokasi Menu
- Login Admin Panel → Dashboard
- Sidebar → **Stok Produk** (ikon 📦)

### ✨ Fitur Utama
Admin dapat mengelola stok untuk:
1. Salon de Fiestas
2. Lucky Block Battleground
3. Disaster Survival
4. Lumber Tycoon 2
5. Pet Ranch Simulator
6. Robux & Gamepass

### 🎯 Cara Menggunakan

1. **Melihat Daftar Stok:**
   - Tabel menampilkan semua produk dengan stok saat ini
   - Stok default adalah 0

2. **Mengubah Stok:**
   - Klik tombol **"Edit"** (biru) pada produk
   - Modal form muncul
   - Masukkan jumlah stok baru
   - Klik **"Simpan"**

3. **Contoh Penggunaan:**
   - Salon Fiestas: Stok 10
   - Lucky Block: Stok 5
   - Jika stok menjadi 0, produk tidak bisa diklik di website

### 🌐 Tampilan di Website Pelanggan

**Jika Stok > 0:**
- Produk dapat diklik dengan normal
- Tidak ada label stok habis

**Jika Stok = 0:**
- Produk tampil dengan opasitas 60% (lebih gelap)
- Label **"🚫 Stok Habis"** tampil di tengah kartu produk
- Background overlay abu-abu transparan
- Produk tidak bisa diklik
- Button/link dinonaktifkan

### 💾 Data Stok
Data stok disimpan di localStorage dengan key: `productStocks`

Contoh struktur:
```json
{
    "salon-fiestas": 10,
    "lucky-block-battleground": 5,
    "disaster-survival": 0,
    "lumber-tycoon-2": 3,
    "pet-ranch-simulator": 2,
    "robux-gamepass": 0
}
```

### 🔄 Sinkronisasi Real-time
- Perubahan stok otomatis tersimpan
- Langsung muncul di website pelanggan
- Tidak perlu reload halaman

---

## 📱 INTEGRASI SEMUA FITUR

### Data Persistence
Semua fitur menggunakan **localStorage**:
- Flash Sales: `flashSales` (Array)
- Website Status: `websiteStatus` (Object)
- Stok Produk: `productStocks` (Object)
- Update Flag: `_adminDataUpdate` (Timestamp)

### Real-time Synchronization
Semua perubahan di admin panel:
1. Disimpan ke localStorage
2. Set trigger `_adminDataUpdate`
3. Website pelanggan mendeteksi melalui storage event
4. Instantly terupdate tanpa reload

### Event Listener di Website
```javascript
window.addEventListener('storage', (e) => {
    if (e.key === 'flashSales' || e.key === '_adminDataUpdate') {
        // Update flash sale display
    }
    if (e.key === 'websiteStatus' || e.key === '_adminDataUpdate') {
        // Check website status
    }
    if (e.key === 'productStocks' || e.key === '_adminDataUpdate') {
        // Update stock display
    }
});
```

---

## 🎯 SKENARIO PENGGUNAAN

### Scenario 1: Flash Sale Weekend
```
Admin Action:
1. Masuk Admin Panel → Flash Sale
2. Klik "Buat Flash Sale"
3. Pilih produk "Robux Gamepass"
4. Harga normal: 50.000 → Flash Sale: 35.000
5. Waktu: Jumat 18:00 - Minggu 23:59
6. Klik Simpan

Website Pelanggan:
- Produk Robux tampil dengan label 🔥 Flash Sale
- Timer countdown tampil
- Pelanggan bisa membeli dengan harga spesial
- Setelah Minggu 23:59, harga otomatis kembali normal
```

### Scenario 2: Maintenance Website
```
Admin Action:
1. Masuk Admin Panel → Buka/Tutup
2. Klik "Tutup Website"
3. Status berubah menjadi 🔴 Sedang Tutup

Website Pelanggan:
- Pop-up overlay muncul
- Pesan "Maaf, Toko Sedang Tutup"
- Pelanggan tidak bisa akses halaman
- Setelah maintenance selesai, admin klik "Buka Website"
```

### Scenario 3: Manajemen Stok
```
Admin Action:
1. Masuk Admin Panel → Stok Produk
2. Lihat stok awal: Salon Fiestas = 5
3. Klik Edit → Ubah menjadi 0
4. Klik Simpan

Website Pelanggan:
- Kartu Salon Fiestas menjadi gelap (opasitas 60%)
- Label "🚫 Stok Habis" tampil
- Tombol beli dinonaktifkan (tidak bisa diklik)
```

---

## 🐛 TROUBLESHOOTING

### Flash Sale tidak tampil di website
✅ **Solusi:**
- Pastikan waktu mulai sudah lewat
- Pastikan waktu berakhir belum lewat
- Refresh halaman website
- Cek localStorage di DevTools (F12 → Application)

### Website status tidak berubah
✅ **Solusi:**
- Refresh halaman website pelanggan
- Cek apakah localStorage `websiteStatus` ter-update
- Gunakan browser yang sama untuk admin dan pelanggan

### Stok tidak ter-update
✅ **Solusi:**
- Pastikan stok diisi dengan angka
- Klik Simpan setelah mengubah
- Refresh halaman website
- Cek di DevTools apakah data tersimpan

---

## 📊 ADMIN CREDENTIALS

```
Username: devrobloxstore
Password: devstore1230
```

---

## 🔐 SECURITY NOTES

⚠️ **Penting:**
- Data disimpan di localStorage (client-side)
- Sesuai untuk demo/testing
- Untuk production, gunakan backend database
- Admin session disimpan di localStorage juga

---

## 📎 FILE YANG TERLIBAT

### Admin Panel
- `/admin/dashboard.html` - UI 3 menu baru
- `/admin/script.js` - Logic semua fitur
- `/admin/style.css` - Styling

### Website Pelanggan
- `/assets/js/website-features.js` - Main logic fitur
- `/assets/css/style.css` - CSS flash sale & stok
- Semua halaman HTML - Script reference

---

**Update terakhir: 14 November 2025**
**Dibuat untuk Dev Roblox Shop**
