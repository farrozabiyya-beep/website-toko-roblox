# 📱 PANDUAN ORDER ID DI WHATSAPP

Dokumentasi lengkap untuk fitur Order ID yang otomatis ditambahkan saat pelanggan mengirim pesan WhatsApp.

---

## 🎯 FITUR ORDER ID OTOMATIS

### Apa itu?
Setiap kali pelanggan klik "Ingin Melanjutkan Pembayaran", sistem otomatis:
1. ✅ Generate unique Order ID (format: `ORD` + timestamp)
2. ✅ Tambahkan Order ID ke pesan WhatsApp
3. ✅ Buka chat WhatsApp dengan ID sudah di dalam pesan
4. ✅ Simpan data order di LocalStorage
5. ✅ Tampilkan Order ID di success popup

---

## 📋 FORMAT PESAN WHATSAPP

### Contoh Pesan yang Dikirim:
```
Halo min, saya ingin membeli:

Username: ZhenWill90
Item: 50 Robux
Harga: Rp 50.000
Metode Pembayaran: GoPay

📋 ID Pesanan: ORD1731514677123

Mohon segera diproses. Terima kasih!
```

### Breakdown Format:
- **Baris 1-5**: Informasi pembelian (username, item, harga, metode)
- **Baris 6**: ID Pesanan dengan emoji 📋 dan format `ORD[timestamp]`
- **Baris 7**: Penutup polite

---

## 🔐 FORMAT ORDER ID

### Struktur Order ID:
```
ORD + Timestamp (milliseconds)
Contoh: ORD1731514677123
```

### Keuntungan Format Ini:
- ✅ **Unique**: Setiap order pasti berbeda (based on timestamp)
- ✅ **Sequential**: Ordered by waktu creation
- ✅ **Human-readable**: Admin bisa tau kapan order dibuat
- ✅ **No special characters**: Safe untuk URL & database

### Cara Decode Timestamp:
```javascript
// Dari: ORD1731514677123
// Ambil angka: 1731514677123
const timestamp = 1731514677123;
const date = new Date(timestamp);
console.log(date); // Mon Nov 14 2025 11:04:37 GMT+0700
```

---

## 💾 DATA ORDER DI LOCALSTORAGE

### Key: `orders`
```javascript
// Struktur data:
[
    {
        "id": "ORD1731514677123",           // Unique Order ID
        "username": "ZhenWill90",           // Username Roblox
        "item": "50 Robux",                 // Item yang dibeli
        "price": 50000,                     // Harga dalam Rupiah
        "paymentMethod": "gopay",           // Metode pembayaran
        "status": "pending",                // Status order
        "date": "14/11/2025"               // Tanggal pembelian
    },
    // ... lebih banyak order
]
```

### Akses dari DevTools:
```javascript
// Di console browser:
JSON.parse(localStorage.getItem('orders'))
// Output: [{ id: "ORD1731514677123", ... }]
```

---

## 🔗 WHATSAPP INTEGRATION

### Nomor Admin:
```
6281214477714
```

### URL Format:
```
https://wa.me/6281214477714?text=[pesan terenkripsi]
```

### Cara Kerja:
1. Pesan disiapkan dengan semua informasi
2. Pesan di-encode menggunakan `encodeURIComponent()`
3. URL WhatsApp dibuka dengan `window.open()`
4. Browser/WhatsApp app membuka chat secara otomatis
5. Pesan sudah ada di input field, tinggal send

### Contoh Kode:
```javascript
const message = `Halo min, saya ingin membeli:

Username: ZhenWill90
Item: 50 Robux
Harga: Rp 50.000
Metode Pembayaran: GoPay

📋 ID Pesanan: ORD1731514677123

Mohon segera diproses. Terima kasih!`;

const encoded = encodeURIComponent(message);
const url = `https://wa.me/6281214477714?text=${encoded}`;
window.open(url, '_blank');
```

---

## ✅ SUCCESS POPUP DENGAN ORDER ID

### Tampilan Success Popup:
```
┌─────────────────────────────────┐
│     ✅ (icon check hijau)        │
│                                 │
│  Terima Kasih! 😇               │
│                                 │
│ Terima kasih telah mengisi       │
│ data pembelian kamu              │
│                                 │
│ Silahkan cek di PesananKu,      │
│ dan kamu akan dialihkan ke       │
│ halaman utama ya                 │
│                                 │
│ ┌───────────────────────────┐   │
│ │ 📋 ID Pesanan Anda:       │   │
│ │ ORD1731514677123          │   │
│ │ Simpan untuk referensi    │   │
│ └───────────────────────────┘   │
│                                 │
│ Terima kasih 🙏                 │
│                                 │
│ [Tutup & Ke Halaman Utama]      │
└─────────────────────────────────┘
```

### Fitur:
- ✅ Order ID ditampilkan dengan background gradient biru
- ✅ Monospace font untuk mudah dicopy
- ✅ Text "Simpan untuk referensi" membantu pelanggan
- ✅ Auto close dalam 10 detik atau klik tombol
- ✅ Redirect ke halaman utama setelah close

---

## 📊 WORKFLOW LENGKAP

```
┌─────────────────────────────────────────────────────────┐
│  PELANGGAN KLIK "INGIN MELANJUTKAN PEMBAYARAN"         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  SISTEM GENERATE ORDER ID (ORD + timestamp)             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  BUAT PESAN WHATSAPP DENGAN ORDER ID                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  OPEN WHATSAPP (https://wa.me/...)                      │
│  Pesan sudah ada di input field                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  SIMPAN ORDER KE LOCALSTORAGE                           │
│  {id: "ORD...", username: "...", ...}                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  TAMPILKAN SUCCESS POPUP                                │
│  Dengan Order ID di dalamnya                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  AUTO REDIRECT KE HALAMAN UTAMA (10 detik)             │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 FITUR PELACAKAN ORDER

### Di Halaman "Pesananku":
- ✅ Pelanggan bisa melihat list order mereka
- ✅ Menampilkan Order ID untuk setiap order
- ✅ Status order (Pending, Diproses, Selesai, Dibatalkan)
- ✅ Tanggal pembelian
- ✅ Total harga

### Di Admin Panel:
- ✅ Admin melihat semua order dengan Order ID
- ✅ Bisa edit status order
- ✅ Bisa lihat nomor WhatsApp pelanggan
- ✅ Real-time sync dari order baru

---

## 💬 EXAMPLE CONVERSATIONS

### Scenario 1: First Time Order
```
PELANGGAN:
"Halo min, saya ingin membeli:

Username: NewPlayer123
Item: 30 Robux
Harga: Rp 30.000
Metode Pembayaran: DANA

📋 ID Pesanan: ORD1731514677000

Mohon segera diproses. Terima kasih!"

ADMIN:
"Halo, order Anda diterima dengan ID ORD1731514677000
Mohon tunggu, sedang kami proses 👍"
```

### Scenario 2: Order Status Update
```
ADMIN:
"Pesanan ORD1731514677000 Anda sudah selesai!
Silakan cek akun Robux Anda 🎉"

PELANGGAN:
"Terima kasih kak! Sudah dikonfirmasi ✅"
```

---

## 🛠️ TECHNICAL IMPLEMENTATION

### File yang Berkaitan:
- `/assets/js/product-pages.js` - Main logic order & WhatsApp
- `/pages/order.html` - Display orders dari localStorage
- `/assets/js/main.js` - Load orders di Pesananku page

### Function Reference:
```javascript
// Generate Order ID
const orderId = 'ORD' + Date.now();

// Create order message
const message = `...dengan ID Pesanan: ${orderId}...`;

// Open WhatsApp
window.open(`https://wa.me/6281214477714?text=${encoded}`, '_blank');

// Show success popup
showSuccessPopup(orderId);

// Save to localStorage
const createdOrder = {
    id: orderId,
    username: username,
    item: item,
    price: price,
    // ...
};
```

---

## ⚙️ KONFIGURASI

### Mengubah Nomor WhatsApp Admin:
1. Edit `/assets/js/product-pages.js`
2. Cari: `const adminPhone = '6281214477714';`
3. Ubah nomor dengan nomor baru (tanpa +, gunakan format: 62xxxxxxxxx)
4. Save & reload website

### Mengubah Format Order ID:
1. Edit `/assets/js/product-pages.js`
2. Cari: `const orderId = 'ORD' + Date.now();`
3. Ubah prefix 'ORD' dengan yang lain (mis: 'ORDER', 'PES', dll)
4. Save & reload website

---

## 📱 TESTING ORDER FLOW

### Test Checklist:
- [ ] Isi form pembelian lengkap
- [ ] Klik "Ingin Melanjutkan Pembayaran"
- [ ] WhatsApp terbuka dengan message sudah ada
- [ ] Message berisi Order ID (format: ORD + angka)
- [ ] Success popup muncul
- [ ] Order ID tampil di success popup dengan background biru
- [ ] Klik "Tutup" atau tunggu 10 detik
- [ ] Redirect ke halaman utama
- [ ] Buka DevTools → Application → localStorage
- [ ] Cek key `orders` punya data order baru dengan ID yang sama
- [ ] Buka halaman "Pesananku"
- [ ] Order tampil di daftar dengan Order ID

---

## 🎯 BEST PRACTICES

### Untuk Admin:
- ✅ Selalu reply dengan Order ID saat konfirmasi
- ✅ Gunakan Order ID untuk referensi di database/pencatatan
- ✅ Jika ada komplain, minta pelanggan sebutkan Order ID
- ✅ Keep track order status dengan akurat

### Untuk Pelanggan:
- ✅ Simpan Order ID untuk referensi
- ✅ Sebutkan Order ID jika ada pertanyaan follow-up
- ✅ Cek status order di halaman "Pesananku"
- ✅ Jangan lupa screenshot pesan WhatsApp sebagai bukti

---

**Dibuat untuk Dev Roblox Shop**
**Update: 14 November 2025**
