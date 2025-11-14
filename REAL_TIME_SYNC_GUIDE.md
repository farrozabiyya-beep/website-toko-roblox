# 📡 Real-Time Synchronization System - Dokumentasi

## Gambaran Umum

Sistem sync real-time memungkinkan website pelanggan dan admin panel tetap terhubung dan ter-sinkronisasi secara otomatis, bahkan jika menggunakan perangkat yang berbeda (HP, tablet, komputer, dll).

### Komponen Utama:

1. **sync-system.js** - Core sync engine (polling + localStorage events)
2. **order-monitor.js** - Customer order status monitoring
3. **admin.js** - Auto-refresh admin panel
4. **Netlify Functions** - Penyimpanan data central

---

## 🔄 Cara Kerja Sistem

### 1️⃣ Customer membuat order (dari HP/Tablet/Komputer)

```
[Customer Website] 
    ↓ (form submit)
[localStorage: 'orders'] ← Data disimpan
    ↓ (async)
[Netlify Functions] ← Data dikirim ke server
```

**Flow Detail:**
- Customer mengisi form order (username, produk, pembayaran, dll)
- Data disimpan ke **localStorage** (untuk offline fallback)
- Data juga dikirim ke **Netlify Functions** (untuk sync server)
- localStorage event di-trigger untuk same-device sync

---

### 2️⃣ Admin panel menerima notifikasi order baru (di komputer lain)

```
[Netlify Functions] (menyimpan order)
    ↓ (setiap 5 detik polling)
[sync-system.js] ← Deteksi ada order baru
    ↓ (trigger event)
[admin.js] ← Auto-refresh table
[showAdminNotification()] ← Toast notification
```

**Flow Detail:**
- Admin panel melakukan polling ke Netlify setiap 5 detik
- Ketika mendeteksi perubahan jumlah order, event di-trigger
- admin.js mendengarkan event dan auto-refresh tabel
- Toast notification muncul di admin panel

---

### 3️⃣ Admin update status order (misal: Pending → Diproses)

```
[Admin Edit Status]
    ↓
[notifyOrderProcessing(orderId)] ← Trigger notification
    ↓
[localStorage: '_orderNotification_XXXXX'] ← Simpan notification
    ↓
[Customer Order Page] ← Deteksi storage change
    ↓
[showOrderNotification()] ← Show toast
[updateOrderDisplayPage()] ← Update table
```

**Flow Detail:**
- Admin edit status order di dashboard
- Sistem trigger notifikasi untuk customer
- Data notification disimpan di localStorage dengan key `_orderNotification_<orderId>`
- Customer page mendengarkan storage event dan menampilkan notifikasi

---

## 📱 Sinkronisasi Multi-Device

### Skenario: Customer buka halaman order di 2 tab berbeda

```
[Tab 1: Order Page A] 
    ↓ (sama localStorage)
[Tab 2: Order Page B]
    ↓ (storage event)
[Keduanya menampilkan data order yang sama]
```

### Skenario: Customer buka di HP, Admin buka di komputer

```
[Customer HP]        [Admin Desktop]
[localStorage]  ←→  [Netlify Functions]  ←→  [Polling]
[Order Form]        [Order receive]          [Auto Refresh]
```

---

## 🛠️ Penggunaan dan API

### Untuk Customer Pages:

#### 1. Mendengarkan order status update
```javascript
// Automatic - tinggal include order-monitor.js
// Di halaman order, customer akan otomatis dapat notifikasi
```

#### 2. Manual trigger untuk monitor
```javascript
if (window.orderStatusMonitor) {
    window.orderStatusMonitor.checkOrderStatus();
}
```

#### 3. Menampilkan notifikasi custom
```javascript
showOrderNotification('Pesanan Anda sudah diterima!', 'success', 'ORD-123');
```

---

### Untuk Admin Panel:

#### 1. Auto-refresh ketika ada order baru
```javascript
// Automatic - tinggal include sync-system.js dan admin.js
// Admin panel akan otomatis refresh setiap ada order baru
```

#### 2. Notify customer tentang status order
```javascript
// Ketika admin update status ke "Diproses":
notifyOrderProcessing('ORD-123');

// Ketika admin update status ke "Selesai":
notifyOrderComplete('ORD-123');

// Custom notification:
notifyOrderReceived('ORD-123');
```

#### 3. Manual refresh
```javascript
window.syncManager.forceSyncNow();
```

#### 4. Tampilkan admin notification
```javascript
showAdminNotification('Order baru dari John!', 'success');
showAdminNotification('Stok habis!', 'warning');
showAdminNotification('Pembayaran gagal!', 'error');
```

---

## ⚙️ Konfigurasi

### Mengubah polling interval (default: 5 detik)

```javascript
// Di sync-system.js, ubah:
this.pollInterval = 5000; // 5000ms = 5 detik

// Contoh: 10 detik
this.pollInterval = 10000;
```

### Disable sync (jika tidak perlu)
```javascript
if (window.syncManager) {
    window.syncManager.stop();
}
```

---

## 🔍 Debugging

### Console logs untuk tracking

Admin panel:
```
📡 SyncManager initialized (type: ADMIN)
▶ Starting sync system...
✓ Polling started (interval: 5000ms)
📊 Order count changed: 2 → 3
🔄 Sync update received, refreshing admin table...
✓ Real-time sync listener configured for admin
```

Customer page:
```
📦 OrderStatusMonitor initialized
▶ Starting order status monitoring...
📋 Loaded 1 customer orders
✓ Order status monitoring started
```

### Test real-time sync

1. Buka admin panel di 1 tab
2. Buka customer page di tab lain
3. Buat order dari customer page
4. Lihat admin panel auto-refresh (dalam 5 detik)

---

## 📊 Data Format

### Order Object Structure

```javascript
{
    id: 'ORD-1731566400000',                    // Order ID
    orderId: 'ORD-1731566400000',
    username: 'playerName',                     // Roblox username
    customer: 'playerName',
    item: '1000 Robux',                         // Item ordered
    totalPrice: 50000,                          // Harga dalam Rupiah
    price: 50000,
    phone: '6281214477714',                     // Nomor WhatsApp
    whatsapp: '6281214477714',
    paymentMethod: 'gopay',                     // Metode pembayaran
    status: 'Pending',                          // Status order
    createdAt: '2024-11-14T10:00:00.000Z',     // Waktu pembuatan
    products: [                                 // Detail produk
        {
            id: 'robux-1000',
            name: '1000 Robux',
            price: 50000,
            quantity: 1
        }
    ]
}
```

---

## 🚀 Optimisasi dan Best Practices

### 1. **Jangan fetch terlalu sering**
- Default 5 detik sudah cukup
- Lebih sering = data usage lebih besar

### 2. **Pause saat tab tidak visible**
- Otomatis di-handle oleh sync-system.js
- Hemat bandwidth dan CPU

### 3. **Error handling**
- Otomatis fallback ke localStorage jika Netlify error
- Data tetap tersimpan lokal

### 4. **Cache data**
- Gunakan `getCachedOrders()` untuk akses cepat
- Tanpa perlu fetch ulang

---

## 🐛 Troubleshooting

### Admin panel tidak auto-refresh

**Penyebab:**
1. sync-system.js tidak ter-include
2. Netlify Functions error
3. Browser cache issue

**Solusi:**
```javascript
// Check apakah sync active
console.log(window.syncManager);

// Force refresh
if (window.syncManager) {
    window.syncManager.forceSyncNow();
}

// Clear cache
localStorage.clear();
```

### Customer tidak dapat notifikasi

**Penyebab:**
1. order-monitor.js tidak ter-include
2. localStorage disabled
3. Order tidak ter-save

**Solusi:**
```javascript
// Check apakah monitor active
console.log(window.orderStatusMonitor);

// Check orders di localStorage
console.log(JSON.parse(localStorage.getItem('orders')));

// Manual check
if (window.orderStatusMonitor) {
    window.orderStatusMonitor.checkOrderStatus();
}
```

### Notifikasi tidak muncul

**Penyebab:**
1. notify function tidak ter-call
2. Browser notification permission disabled
3. CSS animation error

**Solusi:**
```javascript
// Manual test
showOrderNotification('Test message', 'success', 'TEST-123');

// Check console untuk errors
window.syncManager.start();
```

---

## 📈 Monitoring dan Analytics

### Cek jumlah order real-time

```javascript
// Di console customer page
console.log(window.orderStatusMonitor.customerOrders.length);

// Di console admin panel
console.log(window.syncManager.lastOrderCount);
```

### Cek last sync time

```javascript
// Admin panel
console.log(new Date(window.syncManager.getLastSyncTime()));

// Output: Wed Nov 14 2024 10:30:45 GMT+0700 (WIB)
```

---

## 🔒 Security Notes

1. **localStorage bukan encrypted** - jangan simpan sensitive data
2. **Order IDs bersifat public** - customer bisa lihat order orang lain jika tahu ID-nya
3. **Netlify Functions perlu rate limiting** - untuk production

### Rekomendasi:
- Add authentication token di Netlify Functions
- Validate order ownership saat fetch
- Encrypt sensitive data jika perlu

---

## 📞 Support dan Questions

Jika ada pertanyaan atau issue:
1. Cek console (F12 → Console tab)
2. Lihat log messages yang sudah printed
3. Test force sync: `window.syncManager.forceSyncNow()`
4. Check Netlify Functions logs

---

## ✅ Checklist Implementasi

- ✅ sync-system.js di-include di index.html
- ✅ sync-system.js di-include di admin/dashboard.html
- ✅ order-monitor.js di-include di semua pages
- ✅ admin.js configured dengan sync listener
- ✅ script.js memiliki showAdminNotification function
- ✅ product-pages.js send order ke Netlify
- ✅ main.js createOrder function updated
- ✅ Netlify Functions berjalan

---

**Status**: ✅ System Live dan Operational
**Last Updated**: 2024-11-14
**Version**: 1.0
