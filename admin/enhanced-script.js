// ========== ENHANCED ADMIN DASHBOARD SCRIPT ==========

// LOGIN CREDENTIALS
const ADMIN_CREDS = {
    username: 'devrobloxstore',
    password: 'devstore1230'
};

// Check admin login
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    
    // If on login page
    if (document.getElementById('loginForm')) {
        console.log('Login form detected');
        setupAdminLoginForm();
    }
    // If on dashboard page
    else if (document.getElementById('pesananForm')) {
        console.log('Dashboard detected - checking login');
        checkAdminLogin();
        setupEnhancedDashboard();
    } else {
        console.log('Unknown page');
    }
});

// ========== ENHANCED LOGIN SETUP ==========
function setupAdminLoginForm() {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (!form) {
        console.error('Login form not found!');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log('Login attempt:', { username });

        if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
            console.log('✓ Login berhasil');
            // Simpan session
            localStorage.setItem('adminSession', JSON.stringify({
                username: username,
                loginTime: new Date().getTime()
            }));
            
            // Redirect ke dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            console.log('✗ Login gagal - credential salah');
            errorMessage.textContent = 'Username atau Password salah';
            errorMessage.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
        }
    });
}

// ========== CHECK ADMIN LOGIN ==========
function checkAdminLogin() {
    const session = localStorage.getItem('adminSession');
    console.log('checkAdminLogin - session:', session);
    
    if (!session) {
        console.log('✗ No session found - redirecting to login');
        window.location.href = 'index.html';
        return;
    }

    try {
        const sessionData = JSON.parse(session);
        console.log('✓ Session valid:', sessionData);
        
        const adminUser = document.getElementById('adminUser');
        if (adminUser) {
            adminUser.textContent = `Halo, ${sessionData.username}`;
        }
    } catch (error) {
        console.error('✗ Error parsing session:', error);
        localStorage.removeItem('adminSession');
        window.location.href = 'index.html';
    }

    // Setup theme toggle
    setupThemeToggle();

    // Check permissions
    setupPermissions();
}

// ========== THEME TOGGLE ==========
function setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const newTheme = themeManager.toggleTheme();
            NotificationManager.showInfo(`Mode ${newTheme === 'dark' ? 'Gelap' : 'Terang'} diaktifkan`);
        });
    }
}

// ========== PERMISSION SETUP ==========
function setupPermissions() {
    const session = adminAuth.getSession();

    // Hide/show elements based on role
    document.querySelectorAll('[data-permission]').forEach(el => {
        const requiredRole = el.dataset.permission;
        if (!adminAuth.hasPermission(requiredRole)) {
            el.style.display = 'none';
        }
    });

    // Disable edit/delete for non-admin
    if (session.role !== 'admin' && session.role !== 'owner') {
        document.querySelectorAll('.action-btn.edit-btn, .action-btn.delete-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    }
}

// ========== ENHANCED DASHBOARD SETUP ==========
function setupEnhancedDashboard() {
    setupNavigation();
    setupModals();
    setupForms();
    setupSearchAndFilter();
    setupExportButtons();
    setupAuditLog();

    loadDashboardStats();
    loadPesanan();
    loadAkun();
    loadPromo();
    loadFlashSale();
    loadWebsiteStatus();
    loadStokProduk();
    loadCustomers();

    // Real-time sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'orders' || e.key === '_adminDataUpdate') {
            loadDashboardStats();
            loadPesanan();
        }
        if (e.key === 'customers') {
            loadCustomers();
            loadDashboardStats();
        }
    });

    // Auto-refresh stats every 30 seconds
    setInterval(() => {
        loadDashboardStats();
    }, 30000);

    // Listen for order notifications
    setupOrderNotifications();
}

// ========== LOAD DASHBOARD STATS ==========
function loadDashboardStats() {
    const stats = DashboardStats.getAllStats();

    document.getElementById('orders-today').textContent = stats.todayOrders;
    document.getElementById('total-orders').textContent = stats.totalOrders;
    document.getElementById('total-revenue').textContent = `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`;
    document.getElementById('most-popular-product').textContent = stats.mostPopularProduct;

    // Update additional stats if elements exist
    const pendingElement = document.getElementById('pending-orders');
    if (pendingElement) {
        pendingElement.textContent = stats.pendingOrders;
    }

    const completedElement = document.getElementById('completed-orders');
    if (completedElement) {
        completedElement.textContent = stats.completedOrders;
    }

    const customersElement = document.getElementById('total-customers');
    if (customersElement) {
        customersElement.textContent = stats.totalCustomers;
    }
}

// ========== SEARCH & FILTER SETUP ==========
function setupSearchAndFilter() {
    // Order search
    const orderSearchBtn = document.getElementById('orderSearchBtn');
    if (orderSearchBtn) {
        orderSearchBtn.addEventListener('click', () => {
            const query = document.getElementById('orderSearchInput').value;
            if (query.trim()) {
                const results = DataManager.searchOrders(query);
                renderOrdersTable(results);
            }
        });
    }

    // Order filter
    const orderFilterBtn = document.getElementById('orderFilterBtn');
    if (orderFilterBtn) {
        orderFilterBtn.addEventListener('click', () => {
            const filters = {
                status: document.getElementById('orderFilterStatus').value,
                startDate: document.getElementById('orderFilterStartDate').value,
                endDate: document.getElementById('orderFilterEndDate').value,
                minPrice: parseInt(document.getElementById('orderFilterMinPrice').value) || null,
                maxPrice: parseInt(document.getElementById('orderFilterMaxPrice').value) || null,
                searchQuery: document.getElementById('orderFilterSearch').value
            };

            const results = DataManager.advancedFilterOrders(filters);
            renderOrdersTable(results);
        });
    }

    // Customer search
    const customerSearchBtn = document.getElementById('customerSearchBtn');
    if (customerSearchBtn) {
        customerSearchBtn.addEventListener('click', () => {
            const query = document.getElementById('customerSearchInput').value;
            if (query.trim()) {
                const results = DataManager.searchCustomers(query);
                renderCustomersTable(results);
            }
        });
    }

    // Reset filters
    document.querySelectorAll('.btn-reset-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('orderSearchInput').value = '';
            document.getElementById('customerSearchInput').value = '';
            loadPesanan();
            loadCustomers();
            NotificationManager.showInfo('Filter direset');
        });
    });
}

// ========== EXPORT BUTTONS ==========
function setupExportButtons() {
    // Export orders
    const exportOrdersBtn = document.getElementById('exportOrdersBtn');
    if (exportOrdersBtn) {
        exportOrdersBtn.addEventListener('click', () => {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            DataManager.exportOrdersToCSV(orders);
            NotificationManager.showSuccess('Pesanan berhasil diexport');
        });
    }

    // Export customers
    const exportCustomersBtn = document.getElementById('exportCustomersBtn');
    if (exportCustomersBtn) {
        exportCustomersBtn.addEventListener('click', () => {
            const customers = JSON.parse(localStorage.getItem('customers') || '[]');
            DataManager.exportCustomersToCSV(customers);
            NotificationManager.showSuccess('Pelanggan berhasil diexport');
        });
    }

    // Export products
    const exportProductsBtn = document.getElementById('exportProductsBtn');
    if (exportProductsBtn) {
        exportProductsBtn.addEventListener('click', () => {
            const products = JSON.parse(localStorage.getItem('robloxAccounts') || '[]');
            DataManager.exportProductsToCSV(products);
            NotificationManager.showSuccess('Produk berhasil diexport');
        });
    }

    // Backup
    const backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', () => {
            DataManager.backupAllData();
            NotificationManager.showSuccess('Backup berhasil dibuat');
        });
    }

    // Restore
    const restoreBtn = document.getElementById('restoreBtn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = DataManager.restoreFromBackup(event.target.result);
                    if (result.success) {
                        NotificationManager.showSuccess(result.message);
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        NotificationManager.showError(result.message);
                    }
                };
                reader.readAsText(file);
            });
            input.click();
        });
    }
}

// ========== AUDIT LOG ==========
function setupAuditLog() {
    const auditBtn = document.getElementById('viewAuditLogBtn');
    if (auditBtn) {
        auditBtn.addEventListener('click', () => {
            const audit = adminAuth.getAuditLog(50);
            showAuditLogModal(audit);
        });
    }
}

function showAuditLogModal(auditLog) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'auditLogModal';
    modal.style.display = 'flex';

    let html = `
        <div class="modal-content" style="width: 90%; max-width: 800px;">
            <span class="close">&times;</span>
            <h2>Audit Log</h2>
            <div style="max-height: 500px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Waktu</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Action</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Deskripsi</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    auditLog.forEach(log => {
        const time = new Date(log.timestamp).toLocaleString('id-ID');
        html += `
            <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 10px;">${time}</td>
                <td style="padding: 10px;"><strong>${log.action}</strong></td>
                <td style="padding: 10px;">${log.description}</td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    modal.innerHTML = html;
    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ========== RENDER TABLES ==========
function renderOrdersTable(orders) {
    const tableBody = document.getElementById('pesananTableBody');
    tableBody.innerHTML = '';

    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id || 'ORD-' + String(index + 1).padStart(3, '0')}</td>
            <td>${order.username || order.name || '-'}</td>
            <td>${order.item || '-'}</td>
            <td>Rp ${order.price ? order.price.toLocaleString('id-ID') : order.totalPrice ? order.totalPrice.toLocaleString('id-ID') : '-'}</td>
            <td>
                <select class="status-select" onchange="updatePesananStatus(${index}, this.value)">
                    <option value="Pending" ${(order.status === 'Pending' || order.status === 'pending') ? 'selected' : ''}>Pending</option>
                    <option value="Diproses" ${order.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
                    <option value="Selesai" ${order.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                    <option value="Dibatalkan" ${order.status === 'Dibatalkan' ? 'selected' : ''}>Dibatalkan</option>
                </select>
            </td>
            <td>${order.whatsapp || order.phone || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editPesanan(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deletePesanan(${index})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderCustomersTable(customers) {
    const tableBody = document.getElementById('customersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    customers.forEach((customer) => {
        const row = document.createElement('tr');
        const lastLogin = customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString('id-ID') : '-';
        
        row.innerHTML = `
            <td>${customer.username}</td>
            <td>${customer.email}</td>
            <td>${customer.phone || '-'}</td>
            <td>${customer.orders ? customer.orders.length : 0}</td>
            <td><span style="padding: 4px 8px; border-radius: 4px; background: ${customer.isActive ? '#d4edda' : '#f8d7da'}; color: ${customer.isActive ? '#155724' : '#721c24'};"><strong>${customer.isActive ? 'Aktif' : 'Nonaktif'}</strong></span></td>
            <td>${lastLogin}</td>
        `;
        tableBody.appendChild(row);
    });
}

// ========== LOAD CUSTOMERS ==========
function loadCustomers() {
    const customers = customerAuth.getAllCustomers();
    renderCustomersTable(customers);
}

// ========== ORDER NOTIFICATIONS ==========
function setupOrderNotifications() {
    const lastNotified = sessionStorage.getItem('lastNotifiedOrder') || '0';

    window.addEventListener('storage', (e) => {
        if (e.key === 'orders') {
            const orders = JSON.parse(e.newValue || '[]');
            const lastOrder = orders[orders.length - 1];

            if (lastOrder && lastOrder.id !== lastNotified) {
                NotificationManager.showOrderNotification(lastOrder);
                sessionStorage.setItem('lastNotifiedOrder', lastOrder.id);
            }
        }
    });
}

// ========== NAVIGATION ==========
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            item.classList.add('active');
            const sectionName = item.getAttribute('data-section');
            document.getElementById(`${sectionName}-section`).classList.add('active');
        });
    });
}

// ========== MODAL SETUP ==========
function setupModals() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeModal(modal);
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
}

// ========== FORMS ==========
function setupForms() {
    const pesananForm = document.getElementById('pesananForm');
    if (pesananForm) {
        pesananForm.addEventListener('submit', (e) => {
            e.preventDefault();
            savePesanan();
        });
    }

    const akunForm = document.getElementById('akunForm');
    if (akunForm) {
        akunForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveAkun();
        });
    }

    const promoForm = document.getElementById('promoForm');
    if (promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            savePromo();
        });
    }

    document.getElementById('addPesananBtn').addEventListener('click', openPesananModal);
    document.getElementById('addAkunBtn').addEventListener('click', openAkunModal);
    document.getElementById('addPromoBtn').addEventListener('click', openPromoModal);
}

// ========== PESANAN FUNCTIONS (keep existing code) ==========
function loadPesanan() {
    const pesanan = JSON.parse(localStorage.getItem('orders')) || [];
    renderOrdersTable(pesanan);
    
    const tableBody = document.getElementById('pesananTableBody');
    const emptyState = document.getElementById('pesananEmpty');

    if (pesanan.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('pesananList').style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        document.getElementById('pesananList').style.display = 'block';
    }
}

function openPesananModal() {
    document.getElementById('pesananId').value = '';
    document.getElementById('pesananUsername').value = '';
    document.getElementById('pesananItem').value = '';
    document.getElementById('pesananHarga').value = '';
    document.getElementById('pesananStatus').value = 'Pending';
    document.getElementById('pesananWhatsapp').value = '';
    const modal = document.getElementById('pesananModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function editPesanan(index) {
    const pesanan = JSON.parse(localStorage.getItem('orders')) || [];
    const order = pesanan[index];

    document.getElementById('pesananId').value = index;
    document.getElementById('pesananUsername').value = order.username || order.name || '';
    document.getElementById('pesananItem').value = order.item || '';
    document.getElementById('pesananHarga').value = order.price || order.totalPrice || '';
    document.getElementById('pesananStatus').value = order.status || 'Pending';
    document.getElementById('pesananWhatsapp').value = order.whatsapp || order.phone || '';
    const modal = document.getElementById('pesananModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function savePesanan() {
    const id = document.getElementById('pesananId').value;
    let pesanan = JSON.parse(localStorage.getItem('orders')) || [];

    const newOrder = {
        id: 'ORD-' + String(pesanan.length + 1).padStart(3, '0'),
        username: document.getElementById('pesananUsername').value,
        item: document.getElementById('pesananItem').value,
        price: parseInt(document.getElementById('pesananHarga').value),
        status: document.getElementById('pesananStatus').value,
        whatsapp: document.getElementById('pesananWhatsapp').value,
        createdAt: new Date().getTime()
    };

    if (id === '') {
        pesanan.push(newOrder);
    } else {
        pesanan[parseInt(id)] = newOrder;
    }

    localStorage.setItem('orders', JSON.stringify(pesanan));
    closeModal(document.getElementById('pesananModal'));
    loadPesanan();
    loadDashboardStats();
    NotificationManager.showSuccess('Pesanan berhasil disimpan');
    syncDataToCustomer();
}

function updatePesananStatus(index, status) {
    let pesanan = JSON.parse(localStorage.getItem('orders')) || [];
    pesanan[index].status = status;
    localStorage.setItem('orders', JSON.stringify(pesanan));
    loadDashboardStats();
    syncDataToCustomer();
}

function deletePesanan(index) {
    NotificationManager.showConfirm('Hapus pesanan ini?').then((confirm) => {
        if (confirm) {
            let pesanan = JSON.parse(localStorage.getItem('orders')) || [];
            pesanan.splice(index, 1);
            localStorage.setItem('orders', JSON.stringify(pesanan));
            loadPesanan();
            loadDashboardStats();
            NotificationManager.showSuccess('Pesanan berhasil dihapus');
            syncDataToCustomer();
        }
    });
}

// ========== AKUN FUNCTIONS ==========
function loadAkun() {
    const akun = JSON.parse(localStorage.getItem('robloxAccounts')) || [];
    const tableBody = document.getElementById('akunTableBody');
    const emptyState = document.getElementById('akunEmpty');

    tableBody.innerHTML = '';

    if (akun.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('akunList').style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    document.getElementById('akunList').style.display = 'block';

    akun.forEach((account, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${account.profile || '-'}</td>
            <td>${account.username || '-'}</td>
            <td>Rp ${account.price ? account.price.toLocaleString('id-ID') : '-'}</td>
            <td>${account.stock || 0}</td>
            <td>${account.description || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editAkun(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteAkun(${index})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openAkunModal() {
    document.getElementById('akunId').value = '';
    document.getElementById('akunProfile').value = '';
    document.getElementById('akunUsername').value = '';
    document.getElementById('akunHarga').value = '';
    document.getElementById('akunStok').value = '';
    document.getElementById('akunDeskripsi').value = '';
    const modal = document.getElementById('akunModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function editAkun(index) {
    const akun = JSON.parse(localStorage.getItem('robloxAccounts')) || [];
    const account = akun[index];

    document.getElementById('akunId').value = index;
    document.getElementById('akunProfile').value = account.profile || '';
    document.getElementById('akunUsername').value = account.username || '';
    document.getElementById('akunHarga').value = account.price || '';
    document.getElementById('akunStok').value = account.stock || '';
    document.getElementById('akunDeskripsi').value = account.description || '';
    const modal = document.getElementById('akunModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function saveAkun() {
    const id = document.getElementById('akunId').value;
    let akun = JSON.parse(localStorage.getItem('robloxAccounts')) || [];

    const newAccount = {
        id: 'ACC-' + Date.now(),
        profile: document.getElementById('akunProfile').value,
        username: document.getElementById('akunUsername').value,
        price: parseInt(document.getElementById('akunHarga').value),
        stock: parseInt(document.getElementById('akunStok').value),
        description: document.getElementById('akunDeskripsi').value
    };

    if (id === '') {
        akun.push(newAccount);
    } else {
        newAccount.id = akun[parseInt(id)].id;
        akun[parseInt(id)] = newAccount;
    }

    localStorage.setItem('robloxAccounts', JSON.stringify(akun));
    closeModal(document.getElementById('akunModal'));
    loadAkun();
    NotificationManager.showSuccess('Akun berhasil disimpan');
    syncDataToCustomer();
}

function deleteAkun(index) {
    NotificationManager.showConfirm('Hapus akun ini?').then((confirm) => {
        if (confirm) {
            let akun = JSON.parse(localStorage.getItem('robloxAccounts')) || [];
            akun.splice(index, 1);
            localStorage.setItem('robloxAccounts', JSON.stringify(akun));
            loadAkun();
            NotificationManager.showSuccess('Akun berhasil dihapus');
            syncDataToCustomer();
        }
    });
}

// ========== PROMO FUNCTIONS ==========
function loadPromo() {
    const promo = JSON.parse(localStorage.getItem('promos')) || [];
    const tableBody = document.getElementById('promoTableBody');
    const emptyState = document.getElementById('promoEmpty');

    tableBody.innerHTML = '';

    if (promo.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('promoList').style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    document.getElementById('promoList').style.display = 'block';

    promo.forEach((p, index) => {
        const today = new Date();
        const expiryDate = new Date(p.expiry);
        const isActive = today <= expiryDate;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${p.code}</strong></td>
            <td>${p.discount}%</td>
            <td>${new Date(p.expiry).toLocaleDateString('id-ID')}</td>
            <td>
                <span class="badge ${isActive ? 'active' : 'expired'}">
                    ${isActive ? 'Aktif' : 'Kadaluarsa'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editPromo(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deletePromo(${index})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openPromoModal() {
    document.getElementById('promoId').value = '';
    document.getElementById('promoKode').value = '';
    document.getElementById('promoDiskon').value = '';
    document.getElementById('promoBerlakuHingga').value = '';
    const modal = document.getElementById('promoModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function editPromo(index) {
    const promo = JSON.parse(localStorage.getItem('promos')) || [];
    const p = promo[index];

    document.getElementById('promoId').value = index;
    document.getElementById('promoKode').value = p.code || '';
    document.getElementById('promoDiskon').value = p.discount || '';
    document.getElementById('promoBerlakuHingga').value = p.expiry || '';
    const modal = document.getElementById('promoModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function savePromo() {
    const id = document.getElementById('promoId').value;
    let promo = JSON.parse(localStorage.getItem('promos')) || [];

    const newPromo = {
        code: document.getElementById('promoKode').value,
        discount: parseInt(document.getElementById('promoDiskon').value),
        expiry: document.getElementById('promoBerlakuHingga').value
    };

    if (id === '') {
        promo.push(newPromo);
    } else {
        promo[parseInt(id)] = newPromo;
    }

    localStorage.setItem('promos', JSON.stringify(promo));
    closeModal(document.getElementById('promoModal'));
    loadPromo();
    NotificationManager.showSuccess('Promo berhasil disimpan');
    syncDataToCustomer();
}

function deletePromo(index) {
    NotificationManager.showConfirm('Hapus promo ini?').then((confirm) => {
        if (confirm) {
            let promo = JSON.parse(localStorage.getItem('promos')) || [];
            promo.splice(index, 1);
            localStorage.setItem('promos', JSON.stringify(promo));
            loadPromo();
            NotificationManager.showSuccess('Promo berhasil dihapus');
            syncDataToCustomer();
        }
    });
}

// ========== FLASH SALE FUNCTIONS ==========
function loadFlashSale() {
    const flashSales = JSON.parse(localStorage.getItem('flashSales') || '[]');
    const tbody = document.getElementById('flashSaleTableBody');
    const emptyState = document.getElementById('flashSaleEmpty');
    const list = document.getElementById('flashSaleList');

    tbody.innerHTML = '';

    if (flashSales.length === 0) {
        list.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    list.style.display = 'block';
    emptyState.style.display = 'none';

    flashSales.forEach((sale, index) => {
        const now = new Date().getTime();
        const mulai = new Date(sale.waktuMulai).getTime();
        const berakhir = new Date(sale.waktuBerakhir).getTime();
        
        let status = 'Mendatang';
        if (now >= mulai && now <= berakhir) {
            status = 'Aktif';
        } else if (now > berakhir) {
            status = 'Selesai';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.produk}</td>
            <td>Rp ${parseInt(sale.hargaNormal).toLocaleString('id-ID')}</td>
            <td>Rp ${parseInt(sale.harga).toLocaleString('id-ID')}</td>
            <td>${new Date(sale.waktuMulai).toLocaleString('id-ID')}</td>
            <td>${new Date(sale.waktuBerakhir).toLocaleString('id-ID')}</td>
            <td><span class="badge ${status === 'Aktif' ? 'active' : 'expired'}">${status}</span></td>
            <td>
                <button class="btn-small btn-edit" data-index="${index}">Edit</button>
                <button class="btn-small btn-delete" data-index="${index}">Hapus</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('#flashSaleTableBody .btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            editFlashSale(btn.dataset.index);
        });
    });

    document.querySelectorAll('#flashSaleTableBody .btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            NotificationManager.showConfirm('Hapus flash sale ini?').then((confirm) => {
                if (confirm) {
                    deleteFlashSale(btn.dataset.index);
                }
            });
        });
    });
}

function editFlashSale(index) {
    const flashSales = JSON.parse(localStorage.getItem('flashSales') || '[]');
    const sale = flashSales[index];

    document.getElementById('flashSaleId').value = index;
    document.getElementById('flashSaleProduk').value = sale.produk;
    document.getElementById('flashSaleHargaNormal').value = sale.hargaNormal;
    document.getElementById('flashSaleHarga').value = sale.harga;
    document.getElementById('flashSaleWaktuMulai').value = sale.waktuMulai;
    document.getElementById('flashSaleWaktuBerakhir').value = sale.waktuBerakhir;

    const modal = document.getElementById('flashSaleModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function deleteFlashSale(index) {
    const flashSales = JSON.parse(localStorage.getItem('flashSales') || '[]');
    flashSales.splice(index, 1);
    localStorage.setItem('flashSales', JSON.stringify(flashSales));
    loadFlashSale();
    NotificationManager.showSuccess('Flash sale berhasil dihapus');
}

// ========== WEBSITE STATUS ==========
function loadWebsiteStatus() {
    const status = JSON.parse(localStorage.getItem('websiteStatus') || '{"isOpen": true}');
    const statusText = document.getElementById('websiteStatusText');
    const toggleBtn = document.getElementById('toggleWebsiteBtn');
    const statusBox = document.querySelector('.status-box');

    if (status.isOpen) {
        statusText.textContent = '🟢 Sedang Buka';
        toggleBtn.textContent = '🔴 Tutup Website';
        toggleBtn.classList.remove('btn-danger');
        statusBox.classList.remove('closed');
    } else {
        statusText.textContent = '🔴 Sedang Tutup';
        toggleBtn.textContent = '🟢 Buka Website';
        toggleBtn.classList.add('btn-danger');
        statusBox.classList.add('closed');
    }
}

function toggleWebsite() {
    const status = JSON.parse(localStorage.getItem('websiteStatus') || '{"isOpen": true}');
    status.isOpen = !status.isOpen;
    localStorage.setItem('websiteStatus', JSON.stringify(status));
    loadWebsiteStatus();
    NotificationManager.showSuccess(`Website ${status.isOpen ? 'dibuka' : 'ditutup'}`);
}

// ========== STOK PRODUK ==========
const PRODUCTS = [
    { id: 'robux-gamepass', name: 'Robux Via Gamepass' },
    { id: 'premium', name: 'Upgrade Premium' },
    { id: 'robux-instant', name: 'Robux Instant' },
    { id: 'akun-roblox', name: 'Akun Roblox' },
    { id: 'car-driving', name: 'Car Driving Indonesia' },
    { id: 'taxi-boss', name: 'Taxi Boss' },
    { id: 'steal-brainrot', name: 'Steal a Brainrot' },
    { id: 'strongest-battlegrounds', name: 'Strongest Battlegrounds' },
    { id: 'brookhaven', name: 'Brookhaven RP' },
    { id: 'salon-fiestas', name: 'Salon de Fiestas' },
    { id: 'blox-fruit', name: 'Blox Fruit' },
    { id: 'fisch', name: 'Fisch' },
    { id: 'grow-garden', name: 'Grow Garden' }
];

function loadStokProduk() {
    const stocks = JSON.parse(localStorage.getItem('productStocks') || '{}');
    const tbody = document.getElementById('stokProdukTableBody');

    tbody.innerHTML = '';

    PRODUCTS.forEach(product => {
        const stok = stocks[product.id] || 0;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td><strong>${stok}</strong></td>
            <td>
                <button class="btn-small btn-edit" data-id="${product.id}">Edit</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('#stokProdukTableBody .btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            editStokProduk(btn.dataset.id);
        });
    });
}

function editStokProduk(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const stocks = JSON.parse(localStorage.getItem('productStocks') || '{}');
    const stok = stocks[productId] || 0;

    document.getElementById('stokProdukId').value = productId;
    document.getElementById('stokProdukNama').value = product.name;
    document.getElementById('stokProdukJumlah').value = stok;

    const modal = document.getElementById('stokProdukModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function saveStokProduk(e) {
    e.preventDefault();
    const productId = document.getElementById('stokProdukId').value;
    const jumlah = parseInt(document.getElementById('stokProdukJumlah').value);

    const stocks = JSON.parse(localStorage.getItem('productStocks') || '{}');
    stocks[productId] = jumlah;
    localStorage.setItem('productStocks', JSON.stringify(stocks));

    closeModal(document.getElementById('stokProdukModal'));
    loadStokProduk();
    NotificationManager.showSuccess('Stok berhasil diupdate');
}

// ========== FLASH SALE FORM ==========
document.addEventListener('DOMContentLoaded', () => {
    const flashSaleForm = document.getElementById('flashSaleForm');
    const stokProdukForm = document.getElementById('stokProdukForm');
    const toggleWebsiteBtn = document.getElementById('toggleWebsiteBtn');
    const addFlashSaleBtn = document.getElementById('addFlashSaleBtn');

    if (flashSaleForm) {
        flashSaleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('flashSaleId').value;
            const flashSales = JSON.parse(localStorage.getItem('flashSales') || '[]');
            
            const newSale = {
                produk: document.getElementById('flashSaleProduk').value,
                hargaNormal: document.getElementById('flashSaleHargaNormal').value,
                harga: document.getElementById('flashSaleHarga').value,
                waktuMulai: document.getElementById('flashSaleWaktuMulai').value,
                waktuBerakhir: document.getElementById('flashSaleWaktuBerakhir').value
            };

            if (id) {
                flashSales[id] = newSale;
            } else {
                flashSales.push(newSale);
            }

            localStorage.setItem('flashSales', JSON.stringify(flashSales));

            flashSaleForm.reset();
            document.getElementById('flashSaleId').value = '';
            closeModal(document.getElementById('flashSaleModal'));
            loadFlashSale();
            NotificationManager.showSuccess('Flash sale berhasil disimpan');
        });
    }

    if (stokProdukForm) {
        stokProdukForm.addEventListener('submit', saveStokProduk);
    }

    if (toggleWebsiteBtn) {
        toggleWebsiteBtn.addEventListener('click', toggleWebsite);
    }

    if (addFlashSaleBtn) {
        addFlashSaleBtn.addEventListener('click', () => {
            document.getElementById('flashSaleId').value = '';
            document.getElementById('flashSaleForm').reset();
            const modal = document.getElementById('flashSaleModal');
            modal.classList.add('active');
            modal.style.display = 'flex';
        });
    }
});

// ========== LOGOUT ==========
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            NotificationManager.showConfirm('Yakin ingin logout?').then((confirm) => {
                if (confirm) {
                    adminAuth.logout();
                    NotificationManager.showSuccess('Logout berhasil');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            });
        });
    }
});

// ========== SYNC DATA ==========
function syncDataToCustomer() {
    localStorage.setItem('_adminDataUpdate', new Date().getTime().toString());
}

// ========== AUTO LOGOUT ==========
let logoutTimer;

function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        adminAuth.logout();
        window.location.href = 'index.html';
    }, 30 * 60 * 1000); // 30 minutes
}

document.addEventListener('mousedown', resetLogoutTimer);
document.addEventListener('keydown', resetLogoutTimer);
