// ========== ADMIN.JS - Data Fetching dan Statistik ==========
// Versi 1.0 - Compatible dengan Netlify Functions dan localStorage fallback

// Variabel global untuk menyimpan data pesanan
let allOrders = [];
let statisticsData = {
    ordersToday: 0,
    mostPopularProduct: '',
    totalRevenue: 0,
    totalOrders: 0
};

// ========== FETCH DATA DARI NETLIFY ==========
async function fetchOrdersFromNetlify() {
    try {
        console.log('Fetching orders from /.netlify/functions/saveOrder...');
        
        const response = await fetch('/.netlify/functions/saveOrder', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✓ Data fetched successfully from Netlify:', data);

        // Menyimpan data ke variabel global
        allOrders = Array.isArray(data) ? data : (data.orders || []);
        
        // Update tabel dan statistik
        displayOrdersInTable();
        calculateStatistics();
        displayStatistics();

        return allOrders;
    } catch (error) {
        console.warn('⚠ Error fetching from Netlify:', error);
        console.log('→ Falling back to localStorage...');
        
        // Fallback ke localStorage jika Netlify API tidak tersedia
        loadOrdersFromLocalStorage();
    }
}

// ========== LOAD DATA DARI LOCAL STORAGE ==========
function loadOrdersFromLocalStorage() {
    try {
        const ordersJSON = localStorage.getItem('orders');
        
        if (ordersJSON) {
            allOrders = JSON.parse(ordersJSON);
            console.log('✓ Orders loaded from localStorage:', allOrders);
        } else {
            allOrders = [];
            console.log('ℹ No orders found in localStorage');
        }

        // Tampilkan data
        displayOrdersInTable();
        calculateStatistics();
        displayStatistics();
    } catch (error) {
        console.error('✗ Error loading from localStorage:', error);
        allOrders = [];
        displayOrdersInTable();
    }
}

// ========== TAMPILKAN DATA KE TABEL ==========
function displayOrdersInTable() {
    const tableBody = document.getElementById('pesananTableBody');
    const emptyState = document.getElementById('pesananEmpty');

    if (!tableBody) {
        console.log('⚠ Table element not found');
        return;
    }

    // Kosongkan tabel
    tableBody.innerHTML = '';

    if (allOrders.length === 0) {
        // Tampilkan pesan kosong
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }

    // Sembunyikan pesan kosong
    if (emptyState) {
        emptyState.style.display = 'none';
    }

    // Tambahkan setiap pesanan ke tabel
    allOrders.forEach((order, index) => {
        try {
            const row = document.createElement('tr');
            
            // Format tanggal
            const createdAt = order.createdAt ? 
                new Date(order.createdAt).toLocaleDateString('id-ID') : '-';
            
            // Extract harga dari products array jika ada
            let totalPrice = order.totalPrice || 0;
            let itemList = 'Tidak ada item';
            
            if (Array.isArray(order.products) && order.products.length > 0) {
                itemList = order.products.map(p => `${p.name || p.id} x${p.quantity || 1}`).join(', ');
                if (!totalPrice) {
                    totalPrice = order.products.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
                }
            } else if (order.item) {
                itemList = order.item;
            }

            const statusClass = order.status ? order.status.toLowerCase().replace(/\s+/g, '-') : 'pending';
            const orderId = order.id || order.orderId || `ORD-${index + 1}`;
            const phone = order.phone || order.whatsapp || '-';

            row.innerHTML = `
                <td><strong>${orderId}</strong></td>
                <td>${order.username || order.customer || '-'}</td>
                <td>${itemList}</td>
                <td>Rp ${Number(totalPrice).toLocaleString('id-ID')}</td>
                <td><span class="status-badge status-${statusClass}">${order.status || 'Pending'}</span></td>
                <td>
                    ${phone && phone !== '-' ? 
                        `<a href="https://wa.me/${formatPhoneNumber(phone)}" target="_blank" title="Chat di WhatsApp">
                            <i class="fas fa-phone"></i>
                        </a>` : 
                        '-'
                    }
                </td>
                <td>
                    <button class="btn-small" onclick="editOrder('${orderId}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-danger" onclick="deleteOrder('${orderId}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        } catch (err) {
            console.error('Error rendering row:', err, order);
        }
    });
    
    console.log(`✓ Displayed ${allOrders.length} orders in table`);
}

// ========== FORMAT NOMOR TELEPON ==========
function formatPhoneNumber(phone) {
    if (!phone) return '';
    phone = phone.toString().replace(/\D/g, '');
    if (phone.startsWith('0')) {
        phone = '62' + phone.substring(1);
    } else if (!phone.startsWith('62')) {
        phone = '62' + phone;
    }
    return phone;
}

// ========== HITUNG STATISTIK ==========
function calculateStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Hitung pesanan hari ini
    const ordersToday = allOrders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
    });

    statisticsData.ordersToday = ordersToday.length;

    // Hitung produk paling sering dipesan
    const productCount = {};
    let totalRevenue = 0;

    allOrders.forEach(order => {
        // Hitung revenue
        const price = order.totalPrice || 0;
        totalRevenue += Number(price);

        // Hitung produk
        if (Array.isArray(order.products)) {
            order.products.forEach(product => {
                const productName = product.name || product.id || 'Produk Tidak Dikenal';
                productCount[productName] = (productCount[productName] || 0) + (product.quantity || 1);
            });
        } else if (order.item) {
            productCount[order.item] = (productCount[order.item] || 0) + 1;
        }
    });

    // Cari produk dengan penjualan paling tinggi
    const mostPopular = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];
    statisticsData.mostPopularProduct = mostPopular ? `${mostPopular[0]} (${mostPopular[1]}x)` : 'Tidak ada data';
    statisticsData.totalRevenue = totalRevenue;
    statisticsData.totalOrders = allOrders.length;

    console.log('✓ Statistics calculated:', statisticsData);
}

// ========== TAMPILKAN STATISTIK ==========
function displayStatistics() {
    // Tampilkan statistik hari ini
    const todayElement = document.getElementById('orders-today');
    if (todayElement) {
        todayElement.textContent = statisticsData.ordersToday;
    }

    // Tampilkan produk populer
    const popularElement = document.getElementById('most-popular-product');
    if (popularElement) {
        popularElement.textContent = statisticsData.mostPopularProduct;
    }

    // Tampilkan revenue
    const revenueElement = document.getElementById('total-revenue');
    if (revenueElement) {
        revenueElement.textContent = `Rp ${Number(statisticsData.totalRevenue).toLocaleString('id-ID')}`;
    }

    // Tampilkan total pesanan
    const totalElement = document.getElementById('total-orders');
    if (totalElement) {
        totalElement.textContent = statisticsData.totalOrders;
    }
}

// ========== REFRESH TABEL ==========
function refreshTable() {
    console.log('↻ Refreshing table...');
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyegarkan...';
    }

    // Coba fetch dari Netlify terlebih dahulu
    fetchOrdersFromNetlify().finally(() => {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        }
        console.log('✓ Refresh complete');
    });
}

// ========== EDIT ORDER ==========
function editOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId || o === allOrders[orderId]);
    
    if (!order) {
        alert('Pesanan tidak ditemukan');
        console.warn('Order not found:', orderId);
        return;
    }

    // Cek apakah ada modal edit
    const modal = document.getElementById('pesananModal');
    if (!modal) {
        alert('Form edit tidak tersedia');
        return;
    }

    // Isi form dengan data pesanan
    document.getElementById('pesananId').value = order.id || orderId;
    document.getElementById('pesananUsername').value = order.username || order.customer || '';
    document.getElementById('pesananItem').value = order.item || (Array.isArray(order.products) ? order.products.map(p => p.name).join(', ') : '');
    document.getElementById('pesananHarga').value = order.totalPrice || 0;
    document.getElementById('pesananStatus').value = order.status || 'Pending';
    document.getElementById('pesananWhatsapp').value = order.phone || order.whatsapp || '';

    // Buka modal
    modal.style.display = 'block';
    console.log('✓ Edit mode opened for order:', orderId);
}

// ========== DELETE ORDER ==========
function deleteOrder(orderId) {
    if (!confirm('Yakin ingin menghapus pesanan ini?')) {
        return;
    }

    const originalLength = allOrders.length;
    allOrders = allOrders.filter(o => o.id !== orderId && o !== allOrders[orderId]);
    
    if (allOrders.length < originalLength) {
        // Simpan ke localStorage
        localStorage.setItem('orders', JSON.stringify(allOrders));
        
        // Update tampilan
        displayOrdersInTable();
        calculateStatistics();
        displayStatistics();

        console.log('✓ Order deleted:', orderId);
        alert('Pesanan berhasil dihapus');
    } else {
        console.warn('Order not found for deletion:', orderId);
        alert('Pesanan tidak ditemukan');
    }
}

// ========== INISIALISASI ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Admin.js loaded successfully');

    // Fetch data saat page load
    setTimeout(() => {
        console.log('→ Fetching initial data...');
        fetchOrdersFromNetlify();
    }, 300);

    // Setup refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshTable);
        console.log('✓ Refresh button configured');
    } else {
        console.warn('⚠ Refresh button not found');
    }

    // Listen untuk perubahan di localStorage (dari window/tab lain)
    window.addEventListener('storage', (e) => {
        if (e.key === 'orders' || e.key === '_adminDataUpdate' || e.key === '_customerDataUpdate') {
            console.log('💾 Storage changed externally, reloading...');
            loadOrdersFromLocalStorage();
        }
    });

    // Auto refresh every 5 minutes (opsional)
    // Uncomment line di bawah jika ingin auto refresh
    setInterval(() => {
        // console.log('↻ Auto refresh (5 min)...');
        // fetchOrdersFromNetlify();
    }, 5 * 60 * 1000);

    console.log('✓ Admin panel initialized');
});

// ========== HELPER FUNCTIONS ==========

// Cek koneksi ke API
async function checkApiConnection() {
    try {
        const response = await fetch('/.netlify/functions/saveOrder', { method: 'GET' });
        console.log('✓ API is accessible');
        return true;
    } catch (error) {
        console.warn('⚠ API is not accessible:', error.message);
        return false;
    }
}

// Export untuk testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchOrdersFromNetlify,
        loadOrdersFromLocalStorage,
        displayOrdersInTable,
        calculateStatistics,
        displayStatistics,
        refreshTable,
        editOrder,
        deleteOrder,
        checkApiConnection,
        getAllOrders: () => allOrders,
        getStatistics: () => statisticsData
    };
}

