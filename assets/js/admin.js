// ============ ADMIN DASHBOARD FUNCTIONALITY ============

// Check admin authentication
document.addEventListener('DOMContentLoaded', () => {
    if (!isAdmin()) {
        window.location.href = 'login.html';
        return;
    }

    const adminUser = localStorage.getItem('adminUser');
    document.getElementById('currentUser').textContent = adminUser || 'Admin';

    // Navigation
    setupAdminNavigation();
    
    // Load data
    loadDashboardData();
    loadOrdersData();
    loadStockData();
    loadPromoData();
    loadReviewsData();
});

// ============ NAVIGATION ============
function setupAdminNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.admin-page');
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items and pages
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding page
            const pageName = item.getAttribute('data-page');
            const page = document.getElementById(pageName + '-page');
            if (page) {
                page.classList.add('active');
            }

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

// ============ DASHBOARD DATA ============
function loadDashboardData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];

    document.getElementById('pendingOrders').textContent = pendingCount;
    document.getElementById('completedOrders').textContent = completedCount;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalReviews').textContent = reviews.length;

    // Reports
    document.getElementById('reportTotalOrders').textContent = orders.length;
    document.getElementById('reportTotalRevenue').textContent = formatCurrency(totalRevenue);
}

// ============ ORDERS MANAGEMENT ============
function loadOrdersData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersTableBody = document.getElementById('ordersTableBody');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderSearch = document.getElementById('orderSearch');

    function renderOrders(filteredOrders) {
        ordersTableBody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.username}</td>
                <td>${order.products.map(p => p.name).join(', ')}</td>
                <td>${formatCurrency(order.totalPrice)}</td>
                <td>
                    <span class="badge badge-${order.status}">
                        ${order.status === 'pending' ? 'Menunggu' : order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                    </span>
                </td>
                <td>
                    ${order.status === 'pending' ? `
                        <button class="action-btn action-btn-complete" onclick="completeOrder('${order.id}')">
                            Selesaikan
                        </button>
                    ` : ''}
                    <button class="action-btn action-btn-delete" onclick="deleteOrder('${order.id}')">
                        Hapus
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderOrders(orders);

    // Filter by status
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', () => {
            const status = orderStatusFilter.value;
            const filtered = status ? orders.filter(o => o.status === status) : orders;
            renderOrders(filtered);
        });
    }

    // Search
    if (orderSearch) {
        orderSearch.addEventListener('input', () => {
            const search = orderSearch.value.toLowerCase();
            const filtered = orders.filter(o => 
                o.id.toLowerCase().includes(search) ||
                o.username.toLowerCase().includes(search)
            );
            renderOrders(filtered);
        });
    }
}

function completeOrder(orderId) {
    updateOrderStatus(orderId, 'completed');
    showNotification('Pesanan telah diselesaikan', 'success');
    loadOrdersData();
    loadDashboardData();
}

function deleteOrder(orderId) {
    if (confirm('Yakin ingin menghapus pesanan ini?')) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        showNotification('Pesanan telah dihapus', 'success');
        loadOrdersData();
        loadDashboardData();
    }
}

// ============ STOCK MANAGEMENT ============
// Per-game/product stock structure: productStocks[gameName] = [{name, price, quantity}, ...]
function loadStockData() {
    const productStocks = JSON.parse(localStorage.getItem('productStocks')) || {};
    const stockTableBody = document.getElementById('stockTableBody');
    
    let rows = [];
    
    // Iterate through each game
    Object.keys(productStocks).forEach(gameName => {
        const products = productStocks[gameName];
        if (Array.isArray(products)) {
            products.forEach(product => {
                rows.push(`
                    <tr>
                        <td><strong>${gameName}</strong></td>
                        <td>${product.name}</td>
                        <td>${formatCurrency(product.price)}</td>
                        <td>${product.quantity}</td>
                        <td>
                            <span class="badge ${product.quantity > 0 ? 'badge-success' : 'badge-danger'}">
                                ${product.quantity > 0 ? 'Tersedia' : 'Habis'}
                            </span>
                        </td>
                        <td>
                            <button class="action-btn action-btn-edit" onclick="editProductStock('${gameName}', '${product.name}')">
                                Edit
                            </button>
                            <button class="action-btn action-btn-delete" onclick="deleteProductStock('${gameName}', '${product.name}')">
                                Hapus
                            </button>
                        </td>
                    </tr>
                `);
            });
        }
    });
    
    stockTableBody.innerHTML = rows.join('');
}

function showAddStockModal() {
    document.getElementById('addStockModal').style.display = 'block';
}

function editProductStock(gameName, productName) {
    const productStocks = JSON.parse(localStorage.getItem('productStocks')) || {};
    
    if (!productStocks[gameName]) {
        showNotification('Game tidak ditemukan', 'error');
        return;
    }
    
    const product = productStocks[gameName].find(p => p.name === productName);
    
    if (!product) {
        showNotification('Produk tidak ditemukan', 'error');
        return;
    }
    
    // Populate edit form dengan data produk
    document.getElementById('editStockGame').value = gameName;
    document.getElementById('editStockName').value = productName;
    document.getElementById('editStockPrice').value = product.price;
    document.getElementById('editStockQty').value = product.quantity;
    
    // Simpan game name dan product name untuk submit handler
    const editForm = document.getElementById('editStockForm');
    editForm.dataset.gameName = gameName;
    editForm.dataset.productName = productName;
    
    // Tampilkan modal
    document.getElementById('editStockModal').style.display = 'block';
}

function deleteProductStock(gameName, productName) {
    if (confirm('Yakin ingin menghapus produk ini?')) {
        let productStocks = JSON.parse(localStorage.getItem('productStocks')) || {};
        
        if (productStocks[gameName]) {
            productStocks[gameName] = productStocks[gameName].filter(p => p.name !== productName);
            
            // Hapus game jika tidak ada produk lagi
            if (productStocks[gameName].length === 0) {
                delete productStocks[gameName];
            }
            
            localStorage.setItem('productStocks', JSON.stringify(productStocks));
            showNotification('Produk telah dihapus', 'success');
            loadStockData();
            
            // Emit update event untuk sync ke product pages
            emitStockUpdateEvent(productStocks);
        }
    }
}

// Add Stock Form
const addStockForm = document.getElementById('addStockForm');
if (addStockForm) {
    addStockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const gameName = document.getElementById('stockGameName').value.trim();
        const productName = document.getElementById('stockProductName').value.trim();
        const price = parseInt(document.getElementById('stockProductPrice').value);
        const quantity = parseInt(document.getElementById('stockProductQty').value);

        if (!gameName || !productName || !price || quantity === undefined || quantity < 0) {
            showNotification('Lengkapi semua field dengan benar', 'error');
            return;
        }

        let productStocks = JSON.parse(localStorage.getItem('productStocks')) || {};
        
        // Initialize game array jika belum ada
        if (!productStocks[gameName]) {
            productStocks[gameName] = [];
        }
        
        // Cek apakah produk sudah ada
        const existingProduct = productStocks[gameName].find(p => p.name === productName);
        if (existingProduct) {
            showNotification('Produk dengan nama ini sudah ada untuk game ini', 'error');
            return;
        }
        
        // Tambah produk baru
        productStocks[gameName].push({
            name: productName,
            price: price,
            quantity: quantity
        });
        
        localStorage.setItem('productStocks', JSON.stringify(productStocks));
        
        // Emit update event untuk sync ke product pages
        emitStockUpdateEvent(productStocks);

        showNotification('Stock produk telah ditambahkan', 'success');
        addStockForm.reset();
        document.getElementById('addStockModal').style.display = 'none';
        loadStockData();
    });
}

// Edit Stock Form
const editStockForm = document.getElementById('editStockForm');
if (editStockForm) {
    editStockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const gameName = editStockForm.dataset.gameName;
        const productName = editStockForm.dataset.productName;
        const newQuantity = parseInt(document.getElementById('editStockQty').value);
        
        if (newQuantity === undefined || newQuantity < 0) {
            showNotification('Masukkan jumlah stock yang valid', 'error');
            return;
        }

        let productStocks = JSON.parse(localStorage.getItem('productStocks')) || {};
        
        if (productStocks[gameName]) {
            const productIndex = productStocks[gameName].findIndex(p => p.name === productName);
            
            if (productIndex !== -1) {
                productStocks[gameName][productIndex].quantity = newQuantity;
                localStorage.setItem('productStocks', JSON.stringify(productStocks));
                
                // Emit update event untuk sync ke product pages
                emitStockUpdateEvent(productStocks);
                
                showNotification('Stock berhasil diperbarui', 'success');
                editStockForm.reset();
                document.getElementById('editStockModal').style.display = 'none';
                loadStockData();
            }
        }
    });
}

// Setup modal close handlers
window.addEventListener('click', (e) => {
    const modals = [
        document.getElementById('addStockModal'),
        document.getElementById('editStockModal')
    ];
    
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// ============ PROMO MANAGEMENT ============
function loadPromoData() {
    const promos = JSON.parse(localStorage.getItem('promos')) || [];
    const promoTableBody = document.getElementById('promoTableBody');

    promoTableBody.innerHTML = promos.map(promo => `
        <tr>
            <td>${promo.code}</td>
            <td>${promo.discount}%</td>
            <td>${new Date(promo.expiry).toLocaleDateString('id-ID')}</td>
            <td>
                <span class="badge ${new Date(promo.expiry) > new Date() ? 'badge-success' : 'badge-danger'}">
                    ${new Date(promo.expiry) > new Date() ? 'Aktif' : 'Expired'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-delete" onclick="deletePromo('${promo.id}')">
                    Hapus
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddPromoModal() {
    document.getElementById('addPromoModal').style.display = 'block';
}

function deletePromo(promoId) {
    if (confirm('Yakin ingin menghapus promo ini?')) {
        let promos = JSON.parse(localStorage.getItem('promos')) || [];
        promos = promos.filter(p => p.id !== promoId);
        localStorage.setItem('promos', JSON.stringify(promos));
        showNotification('Promo telah dihapus', 'success');
        loadPromoData();
    }
}

// Add Promo Form
const addPromoForm = document.getElementById('addPromoForm');
if (addPromoForm) {
    addPromoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const code = document.getElementById('promoCode').value.trim().toUpperCase();
        const discount = parseInt(document.getElementById('promoDiscount').value);
        const expiry = document.getElementById('promoExpiry').value;

        if (!code || !discount || !expiry) {
            showNotification('Lengkapi semua field', 'error');
            return;
        }

        let promos = JSON.parse(localStorage.getItem('promos')) || [];
        promos.push({
            id: 'PROMO' + Date.now(),
            code: code,
            discount: discount,
            expiry: expiry
        });
        localStorage.setItem('promos', JSON.stringify(promos));

        showNotification('Kode promo telah ditambahkan', 'success');
        addPromoForm.reset();
        document.getElementById('addPromoModal').style.display = 'none';
        loadPromoData();
    });
}

// ============ PAYMENT METHODS ============
function showEditPaymentModal() {
    showNotification('Modal edit payment akan ditampilkan', 'info');
}

function savePaymentMethods() {
    const paymentMethods = {
        bank: {
            account: document.getElementById('bankAccount').value.trim(),
            name: document.getElementById('bankName').value.trim()
        },
        gopay: document.getElementById('gopayNumber').value.trim(),
        dana: document.getElementById('danaNumber').value.trim(),
        ovo: document.getElementById('ovoNumber').value.trim()
    };

    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    showNotification('Metode pembayaran telah diperbarui', 'success');
}

// ============ REPORTS ============
function downloadReport() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    const reportContent = `
DEV ROBLOX SHOP - LAPORAN PENJUALAN
====================================
Tanggal: ${new Date().toLocaleDateString('id-ID')}

RINGKASAN:
- Total Pesanan: ${orders.length}
- Total Pendapatan: Rp ${totalRevenue.toLocaleString('id-ID')}
- Pesanan Menunggu: ${orders.filter(o => o.status === 'pending').length}
- Pesanan Selesai: ${orders.filter(o => o.status === 'completed').length}

DETAIL PESANAN:
${orders.map(o => `
Order ID: ${o.id}
Username: ${o.username}
Produk: ${o.products.map(p => p.name).join(', ')}
Total: Rp ${o.totalPrice.toLocaleString('id-ID')}
Status: ${o.status}
---`).join('\n')}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', 'laporan-' + new Date().toISOString().split('T')[0] + '.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showNotification('Laporan berhasil diunduh', 'success');
}

// ============ SETTINGS ============
function saveSettings() {
    const storeName = document.getElementById('storeName').value.trim();
    const storeDescription = document.getElementById('storeDescription').value.trim();

    const settings = {
        storeName: storeName,
        storeDescription: storeDescription
    };

    localStorage.setItem('storeSettings', JSON.stringify(settings));
    showNotification('Pengaturan telah disimpan', 'success');
}

// ============ REVIEWS MANAGEMENT ============
function loadReviewsData() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewsTableBody = document.getElementById('reviewsTableBody');

    if (!reviewsTableBody) return;

    reviewsTableBody.innerHTML = reviews.map(review => `
        <tr>
            <td>${review.username}</td>
            <td>${review.text}</td>
            <td>
                <div class="stars">
                    ${Array.from({length: 5}).map((_, i) => 
                        `<i class="fas fa-star" style="color: ${i < review.rating ? '#ffc107' : '#ddd'}; margin-right: 2px;"></i>`
                    ).join('')}
                </div>
            </td>
            <td>
                <button class="action-btn action-btn-delete" onclick="deleteReview('${review.id}')">
                    Hapus
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteReview(reviewId) {
    if (confirm('Yakin ingin menghapus review ini?')) {
        let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews = reviews.filter(r => r.id !== reviewId);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        showNotification('Review telah dihapus', 'success');
        loadReviewsData();
        loadDashboardData();
    }
}

// ============ MODAL CONTROLS ============
const modals = document.querySelectorAll('.modal');

modals.forEach(modal => {
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// ============ RESPONSIVE SIDEBAR ============
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('adminSidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// ============ ADMIN-SHOP SYNC SYSTEM ============

// Create custom event for stock updates
const STOCK_UPDATE_EVENT = 'adminStockUpdated';

/**
 * Emit stock update event ketika admin mengubah stock
 * Ini akan diterima oleh product pages yang sedang terbuka di tab lain
 */
function emitStockUpdateEvent(stocks) {
    const event = new CustomEvent(STOCK_UPDATE_EVENT, {
        detail: {
            stocks: stocks,
            timestamp: new Date().getTime()
        }
    });
    window.dispatchEvent(event);
    
    // Broadcast ke tabs lain menggunakan storage event
    localStorage.setItem('__stockUpdateSignal', JSON.stringify({
        stocks: stocks,
        timestamp: new Date().getTime()
    }));
}

/**
 * Intercept semua stock updates dan emit event
 * Modifikasi loadStockData untuk include emit
 */
const originalLoadStockData = loadStockData;
loadStockData = function() {
    originalLoadStockData.call(this);
    const stocks = JSON.parse(localStorage.getItem('stocks')) || [];
    emitStockUpdateEvent(stocks);
};

// Update form submission untuk emit stock update
const addStockFormListener = document.getElementById('addStockForm');
if (addStockFormListener) {
    const originalSubmit = addStockFormListener.onsubmit;
    addStockFormListener.addEventListener('submit', (e) => {
        setTimeout(() => {
            const stocks = JSON.parse(localStorage.getItem('stocks')) || [];
            emitStockUpdateEvent(stocks);
        }, 100);
    });
}

// Auto-emit stock updates setiap 2 detik untuk keep-alive
setInterval(() => {
    if (document.getElementById('stock-page') && document.getElementById('stock-page').classList.contains('active')) {
        const stocks = JSON.parse(localStorage.getItem('stocks')) || [];
        emitStockUpdateEvent(stocks);
    }
}, 2000);

