# Admin Panel - Dokumentasi Teknis

## 🔧 Arsitektur Sistem

### Overview
```
┌─────────────────────────────────────────────────────────┐
│                   BROWSER ENVIRONMENT                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐        ┌──────────────────────┐  │
│  │   ADMIN PANEL    │        │   CUSTOMER WEBSITE   │  │
│  │  (/admin/)       │        │   (/)                │  │
│  │                  │        │                      │  │
│  │ - index.html     │        │ - index.html         │  │
│  │ - dashboard.html │        │ - pages/*.html       │  │
│  │ - script.js      │        │ - assets/js/*.js     │  │
│  │ - style.css      │        │                      │  │
│  └──────────────────┘        └──────────────────────┘  │
│         │                              │                │
│         └──────────────┬───────────────┘                │
│                        │                                │
│                ┌───────▼────────┐                       │
│                │  LOCALSTORAGE  │                       │
│                │  (Shared Data) │                       │
│                └────────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 File Structure

### Admin Panel Files

#### 1. `/admin/index.html` (Login Page)
- **Purpose:** Autentikasi admin
- **Flow:**
  ```
  User Input → Validate Credentials → Save Session → Redirect
  ```
- **Key IDs:**
  - `#loginForm` - Form login
  - `#username` - Username input
  - `#password` - Password input
  - `#errorMessage` - Error display

#### 2. `/admin/dashboard.html` (Main Dashboard)
- **Purpose:** CRUD operations untuk orders, accounts, promos
- **Sections:**
  ```html
  <header>           <!-- Header dengan logout -->
  <aside>            <!-- Sidebar navigation -->
  <main>
    <section>        <!-- Pesanan tab -->
    <section>        <!-- Akun tab -->
    <section>        <!-- Promo tab -->
  </main>
  <div>              <!-- 3 Modals untuk form -->
  ```

#### 3. `/admin/script.js` (Main Logic)
- **Purpose:** Handle semua logic admin panel
- **Modules:**
  - Login validation
  - Session management
  - Navigation
  - CRUD operations
  - Modal management
  - Real-time sync

#### 4. `/admin/style.css` (Styling)
- **Purpose:** Desain dan layout admin panel
- **Color Scheme:**
  ```css
  --primary: #0047ab      /* Biru gelap */
  --secondary: #00bfff    /* Biru terang */
  --success: #28a745
  --danger: #dc3545
  --warning: #ffc107
  ```

---

## 🔑 Key Functions

### Authentication

#### `setupLoginForm()`
```javascript
// Validate login credentials
// Save adminSession to localStorage
// Redirect to dashboard

// Called in: DOMContentLoaded event
// Credentials: devrobloxstore / devstore1230
```

#### `checkAdminLogin()`
```javascript
// Check if adminSession exists
// Redirect to login if not authenticated
// Display username on dashboard

// Called in: dashboard.html load
```

### Data Management

#### Load Functions
```javascript
loadPesanan()      // Load orders from localStorage
loadAkun()         // Load accounts from localStorage
loadPromo()        // Load promos from localStorage
```

#### Save Functions
```javascript
savePesanan()      // Save order, emit sync event
saveAkun()         // Save account, emit sync event
savePromo()        // Save promo, emit sync event
```

#### Delete Functions
```javascript
deletePesanan(index)  // Delete order with confirmation
deleteAkun(index)     // Delete account with confirmation
deletePromo(index)    // Delete promo with confirmation
```

### Modal Management

```javascript
setupModals()         // Setup modal close buttons
openPesananModal()     // Open order form modal
openAkunModal()        // Open account form modal
openPromoModal()       // Open promo form modal
```

### Sync Events

```javascript
syncDataToCustomer()  // Emit _adminDataUpdate event
                      // Triggers: loadPesanan/loadAkun/loadPromo
                      // in customer website

window.addEventListener('storage', (e) => {
    // Listen for:
    // - orders (from customer website)
    // - _customerDataUpdate (from customer)
    // - robloxAccounts (from other admin tabs)
    // - _adminDataUpdate (from other admin tabs)
})
```

---

## 💾 Data Structures

### Orders
```javascript
{
    id: "ORD-001",              // Unique ID
    username: "PlayerName",     // Roblox username
    item: "100 Robux",          // Item description
    price: 50000,               // Price in Rp
    paymentMethod: "Dana",      // Payment method
    status: "Pending",          // pending, diproses, selesai, dibatalkan
    whatsapp: "6282xxxxxxx",    // Customer phone
    date: "14/11/2024"          // Order date
}
```

### Accounts
```javascript
{
    id: "ACC-1234567890",       // Unique timestamp ID
    profile: "Premium Account", // Account type
    username: "AccountName",    // Roblox account username
    price: 150000,              // Price in Rp
    stock: 2,                   // Available stock
    description: "Rich account" // Description
}
```

### Promos
```javascript
{
    code: "SAVE50",             // Promo code
    discount: 50,               // Discount percentage
    expiry: "2024-12-31"        // Expiry date
}
```

### Admin Session
```javascript
{
    username: "devrobloxstore", // Admin username
    loginTime: 1234567890000    // Login timestamp
}
```

---

## 🔄 Data Flow

### Create Flow
```
User Input → Form Submission → Validate Data → 
Save to localStorage → Emit sync event → 
Refresh table display → Modal close
```

### Update Flow
```
Click Edit → Open modal with data → Modify form → 
Submit → Update localStorage → Emit sync event → 
Refresh table display → Modal close
```

### Delete Flow
```
Click Delete → Confirmation dialog → 
Remove from array → Save to localStorage → 
Emit sync event → Refresh table display
```

### Sync Flow (Real-time)
```
Admin changes data:
  1. Data saved to localStorage
  2. _adminDataUpdate event emitted
  3. Customer website listens (storage event)
  4. Customer website reloads data

Customer creates order:
  1. Order saved to localStorage
  2. _customerDataUpdate event emitted
  3. Admin panel listens (storage event)
  4. Admin panel reloads pesanan table
```

---

## 🧮 Form Validation

### Rules
```javascript
// Orders
- Username required
- Item required
- Harga required (number)
- WhatsApp required

// Accounts
- Profile required
- Username required
- Harga required (number)
- Stok required (number)
- Deskripsi optional

// Promos
- Kode required
- Diskon required (number 0-100)
- BerlakuHingga required (date)
```

### Error Handling
```javascript
// Empty fields
if (!value) {
    showNotification('Field tidak boleh kosong', 'error');
    return;
}

// Invalid number
if (isNaN(price)) {
    showNotification('Harga harus berupa angka', 'error');
    return;
}
```

---

## 📊 localStorage Keys Reference

| Key | Type | Data |
|-----|------|------|
| `orders` | JSON Array | All orders |
| `robloxAccounts` | JSON Array | All accounts |
| `promos` | JSON Array | All promos |
| `adminSession` | JSON Object | Current session |
| `_adminDataUpdate` | Timestamp | Sync trigger from admin |
| `_customerDataUpdate` | Timestamp | Sync trigger from customer |

---

## 🔗 Integration Points

### With product-pages.js
```javascript
// When order is created:
localStorage.setItem('orders', JSON.stringify(orders));
localStorage.setItem('_customerDataUpdate', Date.now().toString());

// Admin panel listens:
window.addEventListener('storage', (e) => {
    if (e.key === '_customerDataUpdate') {
        loadPesanan();  // Auto reload
    }
});
```

### With akun-roblox.html
```javascript
// Load accounts from admin:
let accounts = JSON.parse(localStorage.getItem('robloxAccounts')) || [];

// Listen for updates:
window.addEventListener('storage', (e) => {
    if (e.key === 'robloxAccounts' || e.key === '_adminDataUpdate') {
        loadRobloxAccounts();  // Auto reload
    }
});
```

---

## 🔐 Security Considerations

### Current Limitations
- ⚠️ Password stored in code (client-side only)
- ⚠️ No encryption for localStorage data
- ⚠️ Any user can access localStorage
- ⚠️ No server-side validation

### Recommendations for Production
1. Implement backend authentication
2. Use secure session tokens
3. Encrypt sensitive data
4. Add rate limiting
5. Implement proper authorization
6. Add audit logging
7. Use HTTPS only
8. Implement CORS properly

### Current Security (Demo Only)
```javascript
// For demo/test environment only
const ADMIN_USERNAME = 'devrobloxstore';
const ADMIN_PASSWORD = 'devstore1230';

// Production: Use proper authentication service
// - Firebase Authentication
// - OAuth 2.0
// - JWT tokens
// - Bcrypt password hashing
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Login
- [ ] Valid credentials work
- [ ] Invalid credentials show error
- [ ] Logout clears session
- [ ] Direct dashboard access redirects to login

#### Orders
- [ ] Add order successfully
- [ ] Edit order successfully
- [ ] Delete order with confirmation
- [ ] Change status via dropdown
- [ ] Table updates after add/edit/delete

#### Accounts
- [ ] Add account successfully
- [ ] Edit account successfully
- [ ] Delete account with confirmation
- [ ] Stock updates visible on customer site

#### Promos
- [ ] Add promo successfully
- [ ] Edit promo successfully
- [ ] Delete promo with confirmation
- [ ] Status auto-updates based on date

#### Real-time Sync
- [ ] Add account in admin → shows in customer site
- [ ] Customer creates order → appears in admin
- [ ] Close one tab → data updates in other tab

### Automated Testing (Future)
```javascript
// Unit tests for functions
describe('Admin Panel', () => {
    test('loadPesanan loads orders correctly', () => {
        localStorage.setItem('orders', JSON.stringify([{...}]));
        loadPesanan();
        expect(document.getElementById('pesananTableBody').children.length).toBe(1);
    });
    
    test('savePesanan saves to localStorage', () => {
        // Set form values
        savePesanan();
        const orders = JSON.parse(localStorage.getItem('orders'));
        expect(orders.length).toBe(1);
    });
});
```

---

## 🚀 Performance Optimization

### Current Optimizations
- Event delegation for button clicks
- Efficient DOM manipulation
- Minimal re-renders

### Future Improvements
```javascript
// 1. Pagination for large datasets
loadPesanan(page = 1, limit = 10)

// 2. Search/filter
filterOrders(searchTerm)

// 3. Caching
cache = new Map()

// 4. Lazy loading
lazyLoadAccounts()
```

---

## 📱 Responsive Design

### Breakpoints
```css
Desktop:  >= 1024px (3-column layout)
Tablet:   768px - 1023px (2-column layout)
Mobile:   < 768px (1-column layout)
```

### Mobile Adaptations
- Sidebar becomes hamburger menu
- Table scrolls horizontally
- Modals fullscreen on small devices
- Buttons stack vertically in forms

---

## 🐛 Debugging

### Browser Console Commands

```javascript
// Check login status
localStorage.getItem('adminSession')

// View all orders
JSON.parse(localStorage.getItem('orders'))

// View all accounts
JSON.parse(localStorage.getItem('robloxAccounts'))

// Clear all data (WARNING: destructive)
localStorage.clear()

// Monitor storage changes
window.addEventListener('storage', (e) => console.log('Storage changed:', e))

// Trigger sync manually
localStorage.setItem('_adminDataUpdate', Date.now().toString())
```

### Common Issues

#### Problem: Admin Panel won't load
**Solution:**
```javascript
// Check if JavaScript loaded
console.log('script.js loaded?', typeof checkAdminLogin)

// Check browser console for errors
// Ctrl+Shift+J (Chrome/Firefox)
// F12 → Console tab
```

#### Problem: Real-time sync not working
**Solution:**
```javascript
// Check if events are firing
window.addEventListener('storage', (e) => {
    console.log('Storage event:', e.key, e.newValue)
})

// Manually trigger
localStorage.setItem('_adminDataUpdate', Date.now().toString())
```

#### Problem: Data not saving
**Solution:**
```javascript
// Check localStorage quota
console.log(localStorage)

// Clear old data
localStorage.removeItem('oldkey')

// Try saving again
localStorage.setItem('orders', JSON.stringify(data))
```

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 14, 2024 | Initial release |

---

## 📞 Developer Contact

For technical support or questions:
- Review browser console for errors
- Check localStorage data
- Test in different browser
- Clear cache and reload

---

**Document Version:** 1.0  
**Last Updated:** November 2024  
**Created for:** Dev Roblox Shop Admin Panel
