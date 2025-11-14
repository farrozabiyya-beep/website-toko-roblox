# Dokumentasi Lengkap Fitur Admin & Customer System

## 📋 Daftar Isi
1. [Customer Authentication](#customer-authentication)
2. [Admin User Management](#admin-user-management)
3. [Dashboard Statistics](#dashboard-statistics)
4. [Search & Filter](#search--filter)
5. [Export & Backup](#export--backup)
6. [Dark Mode](#dark-mode)
7. [Notification System](#notification-system)
8. [Audit Log](#audit-log)
9. [Mobile Responsiveness](#mobile-responsiveness)

---

## 🔐 Customer Authentication

### File: `auth/customer-auth.js`

Sistem autentikasi untuk pelanggan dengan fitur lengkap.

### Fitur Utama:
- ✅ Register akun baru
- ✅ Login dengan email & password
- ✅ Profile management
- ✅ Change password
- ✅ Order history tracking
- ✅ Account activation/deactivation

### Cara Menggunakan:

```javascript
// Register
const result = customerAuth.register('username', 'email@example.com', 'password123', '08123456789');
if (result.success) {
    console.log('Registrasi berhasil:', result.customerId);
}

// Login
const loginResult = customerAuth.login('email@example.com', 'password123');
if (loginResult.success) {
    console.log('Login berhasil:', loginResult.customer);
}

// Check if logged in
if (customerAuth.isLoggedIn()) {
    const session = customerAuth.getSession();
    console.log('User:', session.username);
}

// Logout
customerAuth.logout();

// Get customer data
const customer = customerAuth.getCustomerById('CUST-xxx');
const orders = customerAuth.getCustomerOrders('CUST-xxx');

// Update profile
customerAuth.updateProfile('CUST-xxx', {
    phone: '08987654321',
    username: 'newusername'
});

// Change password
customerAuth.changePassword('CUST-xxx', 'oldpass', 'newpass');
```

### Data Structure:
```json
{
    "id": "CUST-timestamp-random",
    "username": "username",
    "email": "email@example.com",
    "password": "hashed_password",
    "phone": "08123456789",
    "createdAt": 1699953600000,
    "lastLogin": 1699953700000,
    "orders": ["ORD-001", "ORD-002"],
    "isActive": true,
    "avatar": null
}
```

### Login Page: `auth/customer-login.html`
Interface untuk customer login dan register dengan:
- Tab switching antara login & register
- Form validation
- Error/success messages
- Loading states
- Dark mode support

---

## 👥 Admin User Management

### File: `auth/admin-auth.js`

Sistem manajemen admin dengan role-based access control.

### Roles:
- `owner` - Akses penuh, bisa manage admin lain
- `admin` - Akses penuh kecuali manage admin
- `staff` - Akses terbatas (edit/delete terbatas)
- `viewer` - Hanya view data

### Cara Menggunakan:

```javascript
// Login admin
const result = adminAuth.login('username', 'password');
if (result.success) {
    console.log('Admin berhasil login:', result.admin);
}

// Check permission
if (adminAuth.hasPermission('admin')) {
    // Hanya admin atau owner
}

// Get session
const session = adminAuth.getSession();
console.log('Role:', session.role);

// Create new admin (owner only)
adminAuth.createAdmin('newadmin', 'pass123', 'admin@example.com', 'staff');

// Update admin
adminAuth.updateAdmin('ADMIN-xxx', {
    email: 'new@example.com',
    role: 'admin',
    isActive: true
});

// Change password
adminAuth.changePassword('ADMIN-xxx', 'oldpass', 'newpass');

// Delete admin (owner only)
adminAuth.deleteAdmin('ADMIN-xxx');

// Logout
adminAuth.logout();
```

### Default Admin:
```
Username: devrobloxstore
Password: devstore1230
Role: Owner
```

---

## 📊 Dashboard Statistics

### File: `assets/js/dashboard-stats.js`

Real-time statistics dan analytics untuk dashboard.

### Fitur:
- Pesanan hari ini
- Total revenue (all-time & today)
- Total orders & customers
- Produk paling populer
- Order by status
- Sales by date (7 hari)
- Product statistics
- Top customers
- Monthly revenue
- Conversion rate

### Cara Menggunakan:

```javascript
// Get all stats
const stats = DashboardStats.getAllStats();
console.log(stats.todayOrders);
console.log(stats.totalRevenue);

// Get specific stats
const todayOrders = DashboardStats.getTodayOrdersCount();
const revenue = DashboardStats.getTotalRevenue();
const products = DashboardStats.getProductStats();
const topCustomers = DashboardStats.getTopCustomers(5);

// Get sales data
const salesData = DashboardStats.getSalesByDate(7); // 7 days
// Returns: { '2024-01-01': { orders: 5, revenue: 500000 }, ... }

// Get conversion rate
const rate = DashboardStats.getConversionRate();
```

### Auto-Refresh:
Dashboard stats refresh otomatis setiap 30 detik.

---

## 🔍 Search & Filter

### File: `assets/js/data-manager.js`

Sistem search dan filter data yang powerful.

### Fitur Search:
```javascript
// Search orders
const results = DataManager.searchOrders('query');

// Search customers
const customers = DataManager.searchCustomers('query');

// Search products
const products = DataManager.searchProducts('query');

// Search promos
const promos = DataManager.searchPromos('query');
```

### Advanced Filter:
```javascript
const filters = {
    status: 'Selesai',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    minPrice: 100000,
    maxPrice: 500000,
    searchQuery: 'username'
};

const results = DataManager.advancedFilterOrders(filters);
```

### Sort:
```javascript
const sorted = DataManager.sortData(data, 'price', 'desc');
// 'asc' atau 'desc'
```

---

## 💾 Export & Backup

### File: `assets/js/data-manager.js`

Export dan backup data dalam berbagai format.

### Export to CSV:
```javascript
// Export orders
DataManager.exportOrdersToCSV();

// Export customers
DataManager.exportCustomersToCSV();

// Export products
DataManager.exportProductsToCSV();

// Export custom data
DataManager.exportToCSV(data, 'filename.csv');
```

### Export to JSON:
```javascript
const data = { orders: [...], customers: [...] };
DataManager.exportToJSON(data, 'backup.json');
```

### Backup All Data:
```javascript
DataManager.backupAllData();
// Akan download file: backup_2024-01-15.json
// Contains: orders, customers, products, promos, flashSales, auditLog
```

### Restore from Backup:
```javascript
// Upload file JSON backup
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const result = DataManager.restoreFromBackup(event.target.result);
        if (result.success) {
            console.log(result.message);
            location.reload();
        }
    };
    reader.readAsText(file);
});
fileInput.click();
```

---

## 🌙 Dark Mode

### File: `assets/js/theme-notification.js`

Toggle antara light mode dan dark mode.

### Cara Menggunakan:

```javascript
// Get current theme
const currentTheme = themeManager.getCurrentTheme(); // 'light' atau 'dark'

// Set theme
themeManager.setTheme('dark');
themeManager.setTheme('light');

// Toggle theme
const newTheme = themeManager.toggleTheme();
```

### Theme Colors:
Theme otomatis di-apply ke seluruh website. CSS variables yang digunakan:
- `--bg-primary`
- `--bg-secondary`
- `--text-primary`
- `--text-secondary`
- `--border-color`

### Toggle Button:
Button theme toggle ada di kanan bawah halaman (🌙 emoji).

---

## 🔔 Notification System

### File: `assets/js/theme-notification.js`

Toast notifications dan alert dialogs.

### Toast Notifications:
```javascript
// Success toast
NotificationManager.showSuccess('Data berhasil disimpan');

// Error toast
NotificationManager.showError('Terjadi kesalahan');

// Warning toast
NotificationManager.showWarning('Perhatian!');

// Info toast
NotificationManager.showInfo('Informasi penting');

// Custom toast
NotificationManager.showToast('Message', 'success', 5000);
// duration: 0 = tidak otomatis tutup
```

### Alert & Confirm Dialogs:
```javascript
// Alert
await NotificationManager.showAlert('Pesan', 'Judul');

// Confirm (returns Promise<boolean>)
const confirmed = await NotificationManager.showConfirm('Yakin?');
if (confirmed) {
    // User klik OK
}
```

### Order Notification:
```javascript
const order = { username: 'customer', item: 'Robux' };
NotificationManager.showOrderNotification(order);
// Akan menampilkan toast + sound (jika tersedia)
```

---

## 📝 Audit Log

### File: `auth/admin-auth.js`

Tracking semua aktivitas admin.

### Log Entries:
```javascript
// Automatically logged:
// - admin_login
// - admin_logout
// - admin_login_failed
// - admin_create
// - admin_update
// - admin_delete
// - admin_change_password
// - backup_restore
```

### Cara Menggunakan:

```javascript
// Get audit log
const logs = adminAuth.getAuditLog(100, {
    adminId: 'ADMIN-xxx',
    action: 'admin_login',
    startDate: timestamp,
    endDate: timestamp
});

// Log entries contain:
// - id
// - timestamp
// - adminId
// - action
// - description
// - userAgent
```

### View Audit Log:
Klik button "Lihat Audit Log" di Settings section untuk melihat history.

---

## 📱 Mobile Responsiveness

### Fitur Mobile:
- ✅ Responsive sidebar (collapse pada mobile)
- ✅ Responsive tables (horizontal scroll)
- ✅ Touch-friendly buttons
- ✅ Optimized form layouts
- ✅ Mobile-optimized modals
- ✅ Dark mode adapts to system preference

### Breakpoints:
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

### Testing:
```css
/* Dalam style.css */
@media (max-width: 768px) {
    .admin-container {
        flex-direction: column;
    }
    /* ... mobile styles */
}
```

---

## 📊 Admin Dashboard Sections

### 1. Statistics Section
Menampilkan 4 stat card:
- Pesanan hari ini
- Produk paling populer
- Total revenue
- Total pesanan

### 2. Pesanan Section
- List pesanan dengan search
- Edit/Delete pesanan
- Change status
- Export to CSV

### 3. Akun Roblox Section
- Manage akun game
- Set harga & stok
- Add/Edit/Delete

### 4. Kode Promo Section
- List promo aktif
- Edit/Delete promo
- Status badge (aktif/kadaluarsa)

### 5. Flash Sale Section
- Create flash sale
- Set time range
- Status tracking

### 6. Website Status Section
- Toggle buka/tutup
- Visual indicator
- Status explanation

### 7. Stok Produk Section
- View semua produk
- Update stok
- Stock management

### 8. Pelanggan Section
- List customer
- Search by username/email/phone
- View order count
- Export customer list

### 9. Analytics Section
- Statistics cards
- Advanced order filter
- Date range filter
- Price range filter

### 10. Pengaturan Section (Admin Only)
- Backup/Restore data
- View audit log
- Export laporan
- Export customers

---

## 🔗 Integrasi dengan Website Utama

### Data Sync:
Data secara otomatis sync between admin dan customer website:
```javascript
// Admin saves data
localStorage.setItem('_adminDataUpdate', timestamp);

// Customer website listens
window.addEventListener('storage', (e) => {
    if (e.key === '_adminDataUpdate') {
        // Reload data
    }
});
```

### Linked Features:
- ✅ Customer orders ditampilkan di admin
- ✅ Customer data managed dari admin
- ✅ Product changes sync ke website
- ✅ Promo updates real-time
- ✅ Website status control

---

## 📈 Fitur Lanjutan

### Real-time Notifications:
Admin mendapat notifikasi ketika:
- Order baru masuk
- Customer baru register
- Data diupdate dari tab lain

### Auto-Logout:
Admin otomatis logout setelah 30 menit inaktif.

### Session Management:
- Session data di-store di sessionStorage
- Login credentials di-validate
- Auto redirect ke login jika session expired

### Role-Based Access Control:
```html
<!-- Element hanya visible untuk admin -->
<div data-permission="admin">
    Hanya admin yang bisa lihat
</div>

<!-- Button disable untuk staff -->
<button class="action-btn edit-btn" 
        style="opacity: 0.5; cursor: not-allowed;">
    Edit (Staff tidak bisa)
</button>
```

---

## 🚀 Performa & Optimisasi

### Local Storage Usage:
- `customers` - Semua customer data
- `orders` - Semua orders
- `adminUsers` - Admin accounts
- `auditLog` - Activity log
- `themePreference` - Theme setting

### Auto-Refresh:
- Dashboard stats: 30 detik
- Storage events: Real-time
- Logout timeout: 30 menit

### Data Persistence:
Semua data tersimpan di browser localStorage dan automatic backup dimungkinkan.

---

## 📞 Troubleshooting

### Login tidak bisa
1. Clear browser cache
2. Check console untuk error
3. Verify credentials benar

### Data tidak sync
1. Check localStorage di console
2. Verify storage events working
3. Check browser incognito mode

### Dark mode tidak bekerja
1. Check browser console
2. Verify CSS variables di-apply
3. Clear theme preference: `localStorage.removeItem('themePreference')`

### Export CSV/JSON tidak download
1. Check popup blocker
2. Verify browser support
3. Check console errors

---

## 📚 API Reference

### CustomerAuth Class
```javascript
// Methods
register(username, email, password, phone)
login(email, password)
logout()
getSession()
isLoggedIn()
getAllCustomers()
getCustomerById(customerId)
getCustomerByEmail(email)
updateProfile(customerId, data)
changePassword(customerId, oldPassword, newPassword)
addOrderToCustomer(customerId, orderId)
getCustomerOrders(customerId)
deactivateAccount(customerId)
exportData()
```

### AdminAuth Class
```javascript
// Methods
login(username, password)
logout()
getSession()
isLoggedIn()
hasPermission(requiredRole)
createAdmin(username, password, email, role, isActive)
getAllAdmins()
getAdminById(adminId)
updateAdmin(adminId, data)
changePassword(adminId, oldPassword, newPassword)
deleteAdmin(adminId)
getAuditLog(limit, filter)
logAudit(adminId, action, description)
```

### DashboardStats Class
```javascript
// Static Methods
getTodayOrdersCount()
getTotalRevenue()
getTodayRevenue()
getTotalOrders()
getMostPopularProduct()
getPendingOrders()
getCompletedOrders()
getTotalCustomers()
getActiveCustomers()
getOrdersByStatus()
getSalesByDate(days)
getProductStats()
getTopCustomers(limit)
getMonthlyRevenue()
getConversionRate()
getAllStats()
```

### DataManager Class
```javascript
// Search Methods
searchOrders(query)
searchCustomers(query)
searchProducts(query)
searchPromos(query)

// Filter Methods
filterOrdersByStatus(status)
filterOrdersByDateRange(startDate, endDate)
advancedFilterOrders(filters)

// Export Methods
exportToCSV(data, filename)
exportToJSON(data, filename)
exportOrdersToCSV(orders)
exportCustomersToCSV(customers)
exportProductsToCSV(products)
backupAllData()
restoreFromBackup(jsonData)

// Utility Methods
sortData(data, field, direction)
```

### NotificationManager Class
```javascript
// Toast Methods
showToast(message, type, duration)
showSuccess(message)
showError(message)
showWarning(message)
showInfo(message)
showOrderNotification(order)

// Dialog Methods
showAlert(message, title)
showConfirm(message, title)
```

### ThemeManager Class
```javascript
// Methods
initTheme()
setTheme(theme)
toggleTheme()
getCurrentTheme()
applyThemeColors(theme)
```

---

## ✅ Checklist Implementasi

- [x] Customer Authentication System
- [x] Admin User Management
- [x] Dashboard Statistics (Real-time)
- [x] Search & Filter Orders
- [x] Export Data (CSV)
- [x] Backup & Restore
- [x] Dark Mode Toggle
- [x] Notification System (Toast + Dialogs)
- [x] Audit Log
- [x] Role-Based Access Control
- [x] Mobile Responsive
- [x] Customer Data Integration
- [x] Order Notifications
- [x] Session Management
- [x] Auto-Logout Feature

---

## 📝 Catatan Penting

1. **Password Hashing**: Saat ini menggunakan simple hash untuk demo. Untuk production, gunakan bcrypt atau library yang lebih aman.

2. **LocalStorage Limit**: Browser memiliki limit ~5-10MB untuk localStorage. Untuk dataset besar, migrate ke IndexedDB atau backend database.

3. **Security**: Untuk production environment:
   - Implement HTTPS
   - Use secure session tokens
   - Add CSRF protection
   - Implement rate limiting
   - Add input validation & sanitization

4. **Data Backup**: Implement automated server-side backup untuk production.

5. **Audit Log**: Untuk production, store audit log di server dengan proper database.

---

Last Updated: 14 November 2025
Version: 1.0.0
