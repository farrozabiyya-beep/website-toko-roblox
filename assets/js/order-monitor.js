// ========== CUSTOMER ORDER STATUS MONITOR ==========
// Real-time monitoring untuk status pesanan customer
// Menampilkan notifikasi ketika admin update status order

/**
 * Monitor order status untuk customer
 */
class OrderStatusMonitor {
    constructor() {
        this.customerOrders = [];
        this.pollInterval = 5000; // 5 seconds
        this.lastCheckedTime = 0;
        
        console.log('📦 OrderStatusMonitor initialized');
    }

    /**
     * Start monitoring order status
     */
    start() {
        console.log('▶ Starting order status monitoring...');
        
        // Load customer's own orders
        this.loadCustomerOrders();
        
        // Setup polling
        this.setupPolling();
        
        // Listen untuk notifications dari admin
        this.listenForAdminNotifications();
        
        console.log('✓ Order status monitoring started');
    }

    /**
     * Load orders dari customer (berdasarkan phone/username yang disimpan)
     */
    loadCustomerOrders() {
        try {
            const customerData = localStorage.getItem('userData');
            if (!customerData) {
                console.log('ℹ No customer data found');
                return;
            }
            
            const userData = JSON.parse(customerData);
            const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
            
            // Filter orders yang milik customer ini
            this.customerOrders = allOrders.filter(o => 
                o.phone === userData.phone || 
                o.username === userData.username ||
                o.whatsapp === userData.phone
            );
            
            console.log(`📋 Loaded ${this.customerOrders.length} customer orders`);
        } catch (error) {
            console.warn('⚠ Error loading customer orders:', error);
        }
    }

    /**
     * Poll untuk status update dari Netlify
     */
    setupPolling() {
        this.pollTimer = setInterval(() => {
            if (document.hidden) return;
            
            this.checkOrderStatus();
        }, this.pollInterval);
    }

    /**
     * Check status update dari Netlify Functions
     */
    async checkOrderStatus() {
        try {
            const response = await fetch('/.netlify/functions/saveOrder', {
                method: 'GET',
                cache: 'no-cache'
            });
            
            if (!response.ok) return;
            
            const allOrders = await response.json();
            
            // Check each customer order
            this.customerOrders.forEach(oldOrder => {
                const updatedOrder = allOrders.find(o => o.id === oldOrder.id);
                
                if (updatedOrder && updatedOrder.status !== oldOrder.status) {
                    console.log(`✓ Order ${oldOrder.id} status updated: ${oldOrder.status} → ${updatedOrder.status}`);
                    
                    // Trigger notification
                    this.showStatusUpdate(updatedOrder);
                    
                    // Update local cache
                    oldOrder.status = updatedOrder.status;
                }
            });
            
        } catch (error) {
            console.warn('⚠ Error checking order status:', error);
        }
    }

    /**
     * Listen untuk notifications dari localStorage (admin notifications)
     */
    listenForAdminNotifications() {
        window.addEventListener('storage', (event) => {
            // Check untuk order notifications
            if (event.key && event.key.startsWith('_orderNotification_')) {
                const orderId = event.key.replace('_orderNotification_', '');
                
                if (event.newValue) {
                    try {
                        const notification = JSON.parse(event.newValue);
                        console.log('🔔 Admin notification for order:', orderId);
                        this.showAdminNotification(notification);
                    } catch (error) {
                        console.warn('⚠ Error parsing notification:', error);
                    }
                }
            }
        });
    }

    /**
     * Show status update notification untuk customer
     */
    showStatusUpdate(order) {
        const statusMessages = {
            'Pending': '⏳ Pesanan Anda sedang ditinjau',
            'Diproses': '🔄 Pesanan Anda sedang diproses',
            'Selesai': '✓ Pesanan Anda telah selesai!',
            'Dibatalkan': '❌ Pesanan Anda dibatalkan'
        };
        
        const message = statusMessages[order.status] || `Status pesanan: ${order.status}`;
        const type = order.status === 'Selesai' ? 'success' : 
                     order.status === 'Dibatalkan' ? 'error' : 'info';
        
        showOrderNotification(message, type, order.id);
        
        // Update halaman jika customer sedang lihat halaman order
        this.updateOrderDisplayPage(order);
    }

    /**
     * Show notification dari admin
     */
    showAdminNotification(notification) {
        showOrderNotification(
            notification.message,
            notification.status === 'completed' ? 'success' : 
            notification.status === 'processing' ? 'info' : 'warning',
            notification.orderId
        );
    }

    /**
     * Update tampilan di halaman order jika ada
     */
    updateOrderDisplayPage(order) {
        const orderRows = document.querySelectorAll('table tbody tr');
        
        orderRows.forEach(row => {
            const orderId = row.cells[0]?.textContent.trim();
            if (orderId === order.id || orderId === order.orderId) {
                // Update status cell
                const statusCell = row.cells[4];
                if (statusCell) {
                    statusCell.innerHTML = `<span class="status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>`;
                }
            }
        });
    }

    /**
     * Stop monitoring
     */
    stop() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
        }
        console.log('⏹ Order status monitoring stopped');
    }
}

/**
 * Show order notification toast
 */
function showOrderNotification(message, type = 'info', orderId = '') {
    const notification = document.createElement('div');
    notification.className = `order-notification notification-${type}`;
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-times-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    const icon = icons[type] || icons['info'];
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#00bfff'
    };
    
    const bgColor = colors[type] || colors['info'];
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas ${icon}"></i>
            <div>
                <div style="font-weight: 600;">${message}</div>
                ${orderId ? `<div style="font-size: 0.85rem; opacity: 0.9;">ID: ${orderId}</div>` : ''}
            </div>
        </div>
        <button class="close-order-notification" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        background: ${bgColor};
        color: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        animation: slideInRight 0.3s ease;
        min-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Close button handler
    notification.querySelector('.close-order-notification').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ========== INITIALIZE ==========
let orderStatusMonitor = null;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on customer pages (not admin)
    if (!window.location.pathname.includes('/admin')) {
        orderStatusMonitor = new OrderStatusMonitor();
        orderStatusMonitor.start();
        
        console.log('%c 📦 ORDER STATUS MONITOR ACTIVE', 'color: #00bfff; font-size: 14px; font-weight: bold;');
    }
});

window.orderStatusMonitor = orderStatusMonitor;
window.showOrderNotification = showOrderNotification;

console.log('%c ✓ Order status monitor module loaded', 'color: #28a745; font-size: 12px;');
