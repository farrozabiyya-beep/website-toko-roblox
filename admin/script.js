// ========== LOGIN CREDENTIALS ==========
const ADMIN_USERNAME = 'devrobloxstore';
const ADMIN_PASSWORD = 'devstore1230';

// ========== CHECK LOGIN ON LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
    // If on login page
    if (document.getElementById('loginForm')) {
        setupLoginForm();
    }
    // If on dashboard page
    else if (document.getElementById('pesananForm')) {
        checkAdminLogin();
        setupDashboard();
    }
});

// ========== LOGIN SETUP ==========
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Login berhasil - simpan session
            localStorage.setItem('adminSession', JSON.stringify({
                username: username,
                loginTime: new Date().getTime()
            }));

            // Redirect ke dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Login gagal
            errorMessage.textContent = 'Username atau Password salah';
            errorMessage.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
        }
    });
}

// ========== CHECK LOGIN ON DASHBOARD ==========
function checkAdminLogin() {
    const session = localStorage.getItem('adminSession');
    
    if (!session) {
        // Belum login - redirect ke login page
        window.location.href = 'index.html';
        return;
    }

    const sessionData = JSON.parse(session);
    document.getElementById('adminUser').textContent = `Halo, ${sessionData.username}`;
}

// ========== LOGOUT ==========
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Yakin ingin logout?')) {
                localStorage.removeItem('adminSession');
                window.location.href = 'index.html';
            }
        });
    }
});

// ========== DASHBOARD SETUP ==========
function setupDashboard() {
    // Setup navigation
    setupNavigation();

    // Setup modals
    setupModals();

    // Setup forms
    setupForms();

    // Load initial data
    loadPesanan();
    loadAkun();
    loadPromo();
    loadFlashSale();
    loadWebsiteStatus();
    loadStokProduk();

    // Listen for storage changes (real-time sync) dari tab/window lain atau customer website
    window.addEventListener('storage', (e) => {
        if (e.key === 'orders' || e.key === '_customerDataUpdate' || e.key === '_adminDataUpdate') {
            loadPesanan();
        }
        if (e.key === 'robloxAccounts' || e.key === '_adminDataUpdate') {
            loadAkun();
        }
        if (e.key === 'promos' || e.key === '_adminDataUpdate') {
            loadPromo();
        }
        if (e.key === 'flashSales' || e.key === '_adminDataUpdate') {
            loadFlashSale();
        }
        if (e.key === 'websiteStatus' || e.key === '_adminDataUpdate') {
            loadWebsiteStatus();
        }
        if (e.key === 'productStocks' || e.key === '_adminDataUpdate') {
            loadStokProduk();
        }
    });
}

// ========== NAVIGATION ==========
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class
            navItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked item
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
                e.stopPropagation(); // Prevent event bubbling
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

// Helper function to close modal
function closeModal(modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
}

// ========== FORM SETUP ==========
function setupForms() {
    // Pesanan Form
    const pesananForm = document.getElementById('pesananForm');
    if (pesananForm) {
        pesananForm.addEventListener('submit', (e) => {
            e.preventDefault();
            savePesanan();
        });
    }

    // Akun Form
    const akunForm = document.getElementById('akunForm');
    if (akunForm) {
        akunForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveAkun();
        });
    }

    // Promo Form
    const promoForm = document.getElementById('promoForm');
    if (promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            savePromo();
        });
    }

    // Add buttons
    document.getElementById('addPesananBtn').addEventListener('click', () => {
        openPesananModal();
    });

    document.getElementById('addAkunBtn').addEventListener('click', () => {
        openAkunModal();
    });

    document.getElementById('addPromoBtn').addEventListener('click', () => {
        openPromoModal();
    });
}

// ========== PESANAN FUNCTIONS ==========
function loadPesanan() {
    const pesanan = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('pesananTableBody');
    const emptyState = document.getElementById('pesananEmpty');

    tableBody.innerHTML = '';

    if (pesanan.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('pesananList').style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    document.getElementById('pesananList').style.display = 'block';

    pesanan.forEach((order, index) => {
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
        whatsapp: document.getElementById('pesananWhatsapp').value
    };

    if (id === '') {
        pesanan.push(newOrder);
    } else {
        pesanan[parseInt(id)] = newOrder;
    }

    localStorage.setItem('orders', JSON.stringify(pesanan));
    closeModal(document.getElementById('pesananModal'));
    loadPesanan();
    syncDataToCustomer();
}

function updatePesananStatus(index, status) {
    let pesanan = JSON.parse(localStorage.getItem('orders')) || [];
    pesanan[index].status = status;
    localStorage.setItem('orders', JSON.stringify(pesanan));
    syncDataToCustomer();
}

function deletePesanan(index) {
    if (confirm('Hapus pesanan ini?')) {
        let pesanan = JSON.parse(localStorage.getItem('orders')) || [];
        pesanan.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(pesanan));
        loadPesanan();
        syncDataToCustomer();
    }
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
    syncDataToCustomer();
}

function deleteAkun(index) {
    if (confirm('Hapus akun ini?')) {
        let akun = JSON.parse(localStorage.getItem('robloxAccounts')) || [];
        akun.splice(index, 1);
        localStorage.setItem('robloxAccounts', JSON.stringify(akun));
        loadAkun();
        syncDataToCustomer();
    }
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
    syncDataToCustomer();
}

function deletePromo(index) {
    if (confirm('Hapus promo ini?')) {
        let promo = JSON.parse(localStorage.getItem('promos')) || [];
        promo.splice(index, 1);
        localStorage.setItem('promos', JSON.stringify(promo));
        loadPromo();
        syncDataToCustomer();
    }
}

// ========== SYNC DATA TO CUSTOMER WEBSITE ==========
function syncDataToCustomer() {
    // Trigger storage event untuk semua tab/window lain
    localStorage.setItem('_adminDataUpdate', new Date().getTime().toString());
}

// ========== ADD CSS FOR BADGE ==========
const style = document.createElement('style');
style.textContent = `
    .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
    }
    .badge.active {
        background: #d4edda;
        color: #155724;
    }
    .badge.expired {
        background: #f8d7da;
        color: #721c24;
    }
    .status-select {
        padding: 6px;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 12px;
    }
    .status-box {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 12px;
        color: white;
        margin: 20px 0;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    .status-content h3 {
        margin: 0 0 15px 0;
        font-size: 1.5rem;
    }
    .status-text {
        font-size: 2rem;
        font-weight: bold;
        margin: 10px 0 20px 0;
    }
    .status-toggle {
        display: inline-block;
    }
    .status-box.closed {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .note-box {
        background: #f8f9fa;
        border-left: 4px solid #667eea;
        padding: 15px;
        border-radius: 4px;
        margin-top: 20px;
    }
    .note-box h4 {
        margin-top: 0;
        color: #333;
    }
`;
document.head.appendChild(style);

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

    // Attach event listeners
    document.querySelectorAll('#flashSaleTableBody .btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;
            editFlashSale(index);
        });
    });

    document.querySelectorAll('#flashSaleTableBody .btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;
            if (confirm('Hapus flash sale ini?')) {
                deleteFlashSale(index);
            }
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
    localStorage.setItem('_adminDataUpdate', new Date().getTime().toString());
    loadFlashSale();
}

// ========== WEBSITE STATUS FUNCTIONS ==========
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
    localStorage.setItem('_adminDataUpdate', new Date().getTime().toString());
    loadWebsiteStatus();
}

// ========== STOK PRODUK FUNCTIONS ==========
const PRODUCTS = [
    // PRODUK UNGGULAN
    { id: 'robux-gamepass', name: 'Robux Via Gamepass' },
    { id: 'premium', name: 'Upgrade Premium' },
    { id: 'robux-instant', name: 'Robux Instant' },
    { id: 'akun-roblox', name: 'Akun Roblox' },
    
    // PRODUK DALAM GAME
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
    const emptyState = document.getElementById('stokProdukEmpty');
    const list = document.getElementById('stokProdukList');

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

    // Attach event listeners
    document.querySelectorAll('#stokProdukTableBody .btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            editStokProduk(id);
        });
    });

    list.style.display = 'block';
    emptyState.style.display = 'none';
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
    localStorage.setItem('_adminDataUpdate', new Date().getTime().toString());

    document.getElementById('stokProdukForm').reset();
    closeModal(document.getElementById('stokProdukModal'));
    loadStokProduk();
}

// ========== SETUP FORM HANDLERS FOR NEW FEATURES ==========
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
            localStorage.setItem('_adminDataUpdate', new Date().getTime().toString());

            flashSaleForm.reset();
            document.getElementById('flashSaleId').value = '';
            closeModal(document.getElementById('flashSaleModal'));
            loadFlashSale();
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

// ========== ADMIN NOTIFICATIONS ==========
/**
 * Show notification toast di admin panel
 */
function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification notification-${type}`;
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    const icon = icons[type] || icons['info'];
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#00bfff'};
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Close button handler
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Add CSS animations untuk notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);
