# 🚀 Setup Guide - Admin & Customer System

## Panduan Lengkap Implementasi Fitur

### Prasyarat
- Browser modern (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage enabled
- Koneksi internet

---

## 📦 File Structure

```
website-toko-roblox/
├── auth/
│   ├── admin-auth.js          # Admin authentication system
│   ├── customer-auth.js       # Customer authentication system
│   └── customer-login.html    # Customer login/register page
├── admin/
│   ├── index.html             # Admin login page
│   ├── dashboard.html         # Admin dashboard
│   ├── script.js              # Original admin script
│   ├── enhanced-script.js     # New enhanced script with features
│   ├── style.css              # Admin styles
│   └── admin.js               # Additional admin functionality
├── assets/
│   ├── js/
│   │   ├── dashboard-stats.js        # Dashboard statistics
│   │   ├── data-manager.js           # Search/Filter/Export
│   │   ├── theme-notification.js    # Dark mode & Notifications
│   │   ├── sync-system.js            # Real-time sync
│   │   └── main.js                   # Main website JS
│   └── css/
│       └── style.css          # Website styles
├── pages/
│   └── (game pages)
└── FEATURES_DOCUMENTATION.md  # Complete documentation
```

---

## 🔧 Installation Steps

### Step 1: Pastikan Semua File Ada
Verifikasi bahwa semua file di atas telah dibuat dan ada di folder yang benar.

### Step 2: Update Admin Login Page
File: `admin/index.html` sudah ada dan support AdminAuth.

### Step 3: Update Admin Dashboard
File: `admin/dashboard.html` sudah ada dan menggunakan `enhanced-script.js`.

### Step 4: Include Scripts
Di `admin/dashboard.html`, pastikan urutan script:
```html
<script src="../auth/admin-auth.js"></script>
<script src="../auth/customer-auth.js"></script>
<script src="../assets/js/dashboard-stats.js"></script>
<script src="../assets/js/data-manager.js"></script>
<script src="../assets/js/theme-notification.js"></script>
<script src="enhanced-script.js"></script>
<script src="admin.js"></script>
<script src="../assets/js/sync-system.js"></script>
```

---

## 🔐 Default Credentials

### Admin Login
```
Username: devrobloxstore
Password: devstore1230
Role: Owner
```

Akun ini dibuat otomatis saat pertama kali diakses.

### Customer Registration
Customers dapat mendaftar melalui: `/auth/customer-login.html`

---

## 🎯 Feature Activation Checklist

### ✅ Customer Authentication
- [x] Implemented: `auth/customer-auth.js`
- [x] Login Page: `auth/customer-login.html`
- [x] Features: Register, Login, Profile, Password change

**Usage:**
```javascript
// Check if customer logged in
if (customerAuth.isLoggedIn()) {
    const session = customerAuth.getSession();
    console.log('Logged in as:', session.username);
}
```

### ✅ Admin User Management
- [x] Implemented: `auth/admin-auth.js`
- [x] Features: Create admin, Login, Role-based access, Audit log

**Usage:**
```javascript
// Admin login
const result = adminAuth.login(username, password);

// Check permission
if (adminAuth.hasPermission('admin')) {
    // Allow admin actions
}
```

### ✅ Dashboard Statistics
- [x] Implemented: `assets/js/dashboard-stats.js`
- [x] Real-time updates every 30 seconds
- [x] Display: Orders, Revenue, Products, Customers

**Auto-displays:**
- Pesanan hari ini
- Total revenue
- Produk paling populer
- Total pesanan

### ✅ Search & Filter
- [x] Implemented: `assets/js/data-manager.js`
- [x] Features: Search, Filter, Advanced filter, Sort

**Available filters:**
- Status (Pending, Diproses, Selesai, Dibatalkan)
- Date range
- Price range
- Free text search

### ✅ Export & Backup
- [x] Implemented: `assets/js/data-manager.js`
- [x] Export formats: CSV, JSON
- [x] Backup: Full data backup
- [x] Restore: Restore from JSON file

**Export types:**
- Orders to CSV
- Customers to CSV
- Products to CSV
- Full backup to JSON

### ✅ Dark Mode
- [x] Implemented: `assets/js/theme-notification.js`
- [x] Toggle button: Bottom-right corner (🌙)
- [x] Auto-apply to all UI elements
- [x] Preference saved to localStorage

**Keyboard shortcut:** (Optional - tidak implemented yet)

### ✅ Notifications
- [x] Toast notifications (Success, Error, Warning, Info)
- [x] Alert dialogs
- [x] Confirm dialogs
- [x] Order notifications

**Auto-triggered:**
- Form submission success/error
- Data updated/deleted
- Login/logout
- New orders

### ✅ Audit Log
- [x] Implemented: `auth/admin-auth.js`
- [x] Tracks: All admin actions
- [x] View: "Lihat Audit Log" button di Settings

**Logged events:**
- Admin login/logout
- Admin CRUD operations
- Data changes
- Backup restore

### ✅ Mobile Responsiveness
- [x] Responsive layout
- [x] Mobile-optimized tables
- [x] Touch-friendly buttons
- [x] Responsive modals
- [x] Dark mode support

---

## 📱 Testing Checklist

### Customer Features
- [ ] Test customer registration at `/auth/customer-login.html`
- [ ] Test customer login
- [ ] Test update profile
- [ ] Test change password
- [ ] Test logout

### Admin Features
- [ ] Test admin login with default credentials
- [ ] Test dashboard loads correctly
- [ ] Test create order
- [ ] Test search orders
- [ ] Test filter orders
- [ ] Test export CSV
- [ ] Test backup data
- [ ] Test restore data
- [ ] Test dark mode toggle
- [ ] Test notifications
- [ ] Test audit log view
- [ ] Test logout

### Mobile Testing
- [ ] Test on mobile device (< 768px)
- [ ] Test responsive tables
- [ ] Test modal on mobile
- [ ] Test touch interactions
- [ ] Test dark mode on mobile

---

## 🔗 Integration with Website

### Adding Login Link to Website
Update `index.html` navigation:
```html
<a href="auth/customer-login.html" class="nav-link">
    <i class="fas fa-user"></i> Login
</a>
```

### Check Customer Session
Tambahkan di main JavaScript file:
```javascript
const session = customerAuth.getSession();
if (session) {
    // Show customer name
    document.getElementById('userDisplay').textContent = session.username;
    // Show logout button
    document.getElementById('logoutBtn').style.display = 'block';
} else {
    // Show login button
    document.getElementById('loginBtn').style.display = 'block';
}
```

### Real-time Data Sync
Data automatically syncs karena `sync-system.js` mendengarkan storage events.

---

## ⚙️ Configuration

### Auto-Logout Timeout
Edit di `admin/enhanced-script.js`:
```javascript
// Default: 30 minutes
logoutTimer = setTimeout(() => {
    adminAuth.logout();
    window.location.href = 'index.html';
}, 30 * 60 * 1000); // Ubah angka ini untuk timeout berbeda
```

### Dashboard Refresh Interval
Edit di `admin/enhanced-script.js`:
```javascript
// Default: 30 seconds
setInterval(() => {
    loadDashboardStats();
}, 30000); // Ubah untuk interval berbeda
```

### Notification Duration
Edit di `assets/js/theme-notification.js`:
```javascript
// Default: 3-6 seconds tergantung tipe
const duration = 4000; // milliseconds
NotificationManager.showToast(message, type, duration);
```

---

## 🛡️ Security Notes

### Untuk Development:
✅ Sudah implemented dengan basic security

### Untuk Production:
⚠️ Perlu upgrade security:

1. **Password Hashing**
   - Saat ini: Simple hash
   - Production: Gunakan bcrypt atau Argon2

2. **Database**
   - Saat ini: localStorage (client-side)
   - Production: Gunakan server database (MySQL, PostgreSQL, MongoDB)

3. **API Authentication**
   - Saat ini: N/A (client-side only)
   - Production: Implement JWT atau OAuth2

4. **HTTPS**
   - Saat ini: Tidak required
   - Production: WAJIB use HTTPS

5. **Input Validation**
   - Saat ini: Basic validation
   - Production: Strict input validation & sanitization

6. **CORS**
   - Saat ini: Not applicable
   - Production: Configure CORS properly

---

## 🐛 Troubleshooting

### Problem: Login tidak bisa
**Solution:**
1. Buka console (F12)
2. Ketik: `adminAuth` - pastikan object ada
3. Cek localStorage: `localStorage.getItem('adminUsers')`
4. Clear cache dan refresh

### Problem: Data tidak sync
**Solution:**
1. Pastikan storage events enabled
2. Check browser localStorage limit
3. Buka multiple tabs dan test sync
4. Check console untuk errors

### Problem: Dark mode tidak bekerja
**Solution:**
1. Buka console
2. Ketik: `themeManager.toggleTheme()`
3. Cek CSS variables: `getComputedStyle(document.documentElement)`
4. Clear theme preference: `localStorage.removeItem('themePreference')`

### Problem: Export tidak berjalan
**Solution:**
1. Disable popup blocker untuk website ini
2. Check browser support (IE11 mungkin tidak support)
3. Check console untuk file API errors
4. Test dengan data minimal

### Problem: Notifications tidak muncul
**Solution:**
1. Cek apakah NotificationManager loaded
2. Console: `NotificationManager.showSuccess('Test')`
3. Check CSS untuk toast positioning
4. Pastikan z-index tidak conflict

---

## 📊 Database Schema (untuk migration ke backend)

### Customers Table
```sql
CREATE TABLE customers (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN,
    avatar VARCHAR(255)
);

CREATE TABLE customer_orders (
    customer_id VARCHAR(50),
    order_id VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### Admins Table
```sql
CREATE TABLE admins (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(100),
    password VARCHAR(255),
    role ENUM('owner','admin','staff','viewer'),
    is_active BOOLEAN,
    created_at TIMESTAMP,
    last_login TIMESTAMP,
    last_modified TIMESTAMP
);
```

### Audit Log Table
```sql
CREATE TABLE audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp BIGINT,
    admin_id VARCHAR(50),
    action VARCHAR(50),
    description TEXT,
    user_agent TEXT,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);
```

---

## 📈 Performance Tips

1. **Reduce localStorage usage:**
   - Archive old orders periodically
   - Limit audit log entries (currently: 5000)

2. **Optimize page load:**
   - Lazy load statistics
   - Debounce search inputs
   - Use pagination untuk table besar

3. **Improve sync:**
   - Use IndexedDB untuk data besar
   - Implement pagination untuk orders/customers
   - Add caching layer

---

## 📞 Support & Maintenance

### Regular Tasks:
- [ ] Monthly backup audit
- [ ] Review audit logs
- [ ] Check localStorage usage
- [ ] Update password policies
- [ ] Test disaster recovery

### Monitoring:
- Monitor console errors
- Check browser compatibility
- Monitor mobile responsiveness
- Test across browsers

---

## 🔄 Version History

### v1.0.0 (14 November 2025)
- ✅ Customer Authentication System
- ✅ Admin User Management
- ✅ Dashboard Statistics
- ✅ Search & Filter
- ✅ Export & Backup
- ✅ Dark Mode
- ✅ Notifications
- ✅ Audit Log
- ✅ Mobile Responsive

---

## 📝 Next Steps

1. **Test all features thoroughly**
2. **Gather user feedback**
3. **Optimize performance**
4. **Plan migration to backend database**
5. **Implement production security measures**
6. **Add more advanced analytics**
7. **Implement payment gateway integration**
8. **Add email notifications**

---

## 📚 Additional Resources

- `FEATURES_DOCUMENTATION.md` - Complete feature documentation
- `admin/enhanced-script.js` - Main dashboard logic
- `assets/js/theme-notification.js` - UI utilities
- `auth/*.js` - Authentication systems

---

**Last Updated:** 14 November 2025
**Current Version:** 1.0.0
**Status:** ✅ Ready for Testing
