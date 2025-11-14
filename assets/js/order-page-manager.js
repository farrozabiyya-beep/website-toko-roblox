// ========== ORDER PAGE IMPROVEMENTS ==========
// Handle:
// 1. Clear all existing order data on first load
// 2. Hide order details until search is done
// 3. Add swipe functionality for mobile
// 4. Mobile-friendly order display

class OrderPageManager {
    constructor() {
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.currentOrderIndex = 0;
    }

    init() {
        // Clear all old order data on page load (hanya sekali)
        this.clearOldOrderData();

        // Hide results container initially
        this.hideResultsInitially();

        // Setup swipe gesture untuk mobile
        this.setupTouchSwipe();

        // Listen untuk storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'orders' || e.key === '_adminDataUpdate') {
                console.log('Orders updated from another tab');
            }
        });

        console.log('✓ Order Page Manager initialized');
    }

    clearOldOrderData() {
        // Clear old order data - hanya jalankan satu kali
        const hasBeenCleared = localStorage.getItem('_orderDataCleared');
        if (!hasBeenCleared) {
            localStorage.removeItem('orders');
            localStorage.setItem('_orderDataCleared', 'true');
            console.log('✓ Old order data cleared');
        }
    }

    hideResultsInitially() {
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Gunakan fitur pencarian di atas untuk menemukan pesanan Anda</p>
                </div>
            `;
        }
    }

    setupTouchSwipe() {
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) return;

        resultsContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, false);

        resultsContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const completedOrders = orders.filter(o => o.status === 'Selesai' || o.status === 'selesai');

            if (completedOrders.length === 0) return;

            if (diff > 0) {
                // Swipe ke kiri - next order
                this.currentOrderIndex = (this.currentOrderIndex + 1) % completedOrders.length;
            } else {
                // Swipe ke kanan - previous order
                this.currentOrderIndex = (this.currentOrderIndex - 1 + completedOrders.length) % completedOrders.length;
            }

            this.displayCompletedOrdersWithSwipe(completedOrders);
        }
    }

    displayCompletedOrdersWithSwipe(completedOrders) {
        const resultsContainer = document.getElementById('resultsContainer');
        const currentOrder = completedOrders[this.currentOrderIndex];

        const swipeIndicator = completedOrders.length > 1 ? `
            <div style="text-align: center; margin-bottom: 20px; color: var(--dark-gray); font-size: 0.85rem;">
                <p>Pesanan ${this.currentOrderIndex + 1} dari ${completedOrders.length}</p>
                <p style="font-size: 0.8rem; opacity: 0.7;">Geser kiri/kanan untuk melihat pesanan lainnya</p>
            </div>
        ` : '';

        resultsContainer.innerHTML = swipeIndicator + `
            <div class="order-result" style="touch-action: pan-y;">
                <h4>
                    <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                    Pesanan #${currentOrder.id}
                </h4>
                <div class="order-result-item">
                    <span class="order-result-label">Username:</span>
                    <span class="order-result-value">${currentOrder.username || '-'}</span>
                </div>
                <div class="order-result-item">
                    <span class="order-result-label">Item:</span>
                    <span class="order-result-value">${currentOrder.item || '-'}</span>
                </div>
                <div class="order-result-item">
                    <span class="order-result-label">Harga:</span>
                    <span class="order-result-value">Rp ${(currentOrder.price || 0).toLocaleString('id-ID')}</span>
                </div>
                <div class="order-result-item">
                    <span class="order-result-label">Metode Pembayaran:</span>
                    <span class="order-result-value">${currentOrder.paymentMethod || '-'}</span>
                </div>
                <div class="order-result-item">
                    <span class="order-result-label">WhatsApp:</span>
                    <span class="order-result-value">${currentOrder.whatsapp || '-'}</span>
                </div>
                <div class="order-result-item">
                    <span class="order-result-label">Tanggal:</span>
                    <span class="order-result-value">${currentOrder.date || new Date().toLocaleDateString('id-ID')}</span>
                </div>
                <span class="order-status completed">
                    ✓ Selesai
                </span>
            </div>
        `;

        // Add mobile-friendly styling
        if (window.innerWidth <= 768) {
            resultsContainer.style.overflowX = 'hidden';
        }
    }
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    // Cek apakah kita di halaman order
    if (window.location.pathname.includes('order.html')) {
        const orderPageManager = new OrderPageManager();
        orderPageManager.init();
    }
});

// Export untuk digunakan di order.html
window.OrderPageManager = OrderPageManager;
