/**
 * Advanced Order Management System
 * Dengan proper data persistence dan real-time sync
 */

class OrderManagementSystem {
    constructor() {
        this.storageKey = 'orders';
        this.orders = this.loadOrders();
        this.listeners = [];
        this.initSync();
    }

    /**
     * Load orders from localStorage
     */
    loadOrders() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading orders:', error);
            return [];
        }
    }

    /**
     * Save orders to localStorage
     */
    saveOrders() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
            this.notifyListeners();
        } catch (error) {
            console.error('Error saving orders:', error);
        }
    }

    /**
     * Create new order
     */
    createOrder(orderData) {
        const order = {
            id: this.generateOrderId(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customerId: orderData.customerId || this.generateCustomerId()
        };

        this.orders.unshift(order); // Add to beginning
        this.saveOrders();
        return order;
    }

    /**
     * Update order
     */
    updateOrder(orderId, updates) {
        const order = this.findOrder(orderId);
        if (!order) return null;

        Object.assign(order, updates, {
            updatedAt: new Date().toISOString()
        });

        this.saveOrders();
        return order;
    }

    /**
     * Update order status
     */
    updateOrderStatus(orderId, status) {
        return this.updateOrder(orderId, { status });
    }

    /**
     * Delete order
     */
    deleteOrder(orderId) {
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            const deleted = this.orders.splice(index, 1);
            this.saveOrders();
            return deleted[0];
        }
        return null;
    }

    /**
     * Find single order
     */
    findOrder(orderId) {
        return this.orders.find(o => o.id === orderId);
    }

    /**
     * Get orders by customer
     */
    getOrdersByCustomer(customerId) {
        return this.orders.filter(o => o.customerId === customerId);
    }

    /**
     * Get orders by status
     */
    getOrdersByStatus(status) {
        return this.orders.filter(o => o.status === status);
    }

    /**
     * Search orders
     */
    searchOrders(query) {
        const q = query.toLowerCase();
        return this.orders.filter(o => 
            o.id.toLowerCase().includes(q) ||
            o.username?.toLowerCase().includes(q) ||
            o.email?.toLowerCase().includes(q) ||
            o.phone?.includes(q)
        );
    }

    /**
     * Get all orders
     */
    getAllOrders() {
        return [...this.orders];
    }

    /**
     * Get order statistics
     */
    getStats() {
        const total = this.orders.length;
        const pending = this.orders.filter(o => o.status === 'pending').length;
        const completed = this.orders.filter(o => o.status === 'completed').length;
        const failed = this.orders.filter(o => o.status === 'failed').length;
        const revenue = this.orders.reduce((sum, o) => 
            sum + (o.status === 'completed' ? (o.total || 0) : 0), 0
        );

        return { total, pending, completed, failed, revenue };
    }

    /**
     * Generate order ID
     */
    generateOrderId() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ORD-${year}${month}${day}-${random}`;
    }

    /**
     * Generate customer ID
     */
    generateCustomerId() {
        return 'CUST-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    }

    /**
     * Subscribe to changes
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Notify listeners
     */
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.orders));
    }

    /**
     * Sync with storage every 2 seconds
     */
    initSync() {
        setInterval(() => {
            const stored = this.loadOrders();
            if (JSON.stringify(stored) !== JSON.stringify(this.orders)) {
                this.orders = stored;
                this.notifyListeners();
            }
        }, 2000);
    }

    /**
     * Export orders as CSV
     */
    exportToCSV() {
        const headers = ['Order ID', 'Username', 'Email', 'Phone', 'Product', 'Total', 'Status', 'Created', 'Updated'];
        const rows = this.orders.map(o => [
            o.id,
            o.username || '',
            o.email || '',
            o.phone || '',
            o.productName || '',
            o.total || 0,
            o.status,
            o.createdAt,
            o.updatedAt
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        return csv;
    }

    /**
     * Import orders from CSV
     */
    importFromCSV(csvContent) {
        try {
            const lines = csvContent.split('\n');
            const headers = lines[0].split(',');
            
            lines.slice(1).forEach(line => {
                if (line.trim()) {
                    const values = line.split(',').map(v => v.replace(/"/g, ''));
                    // Map values to order object
                    const order = {
                        id: values[0],
                        username: values[1],
                        email: values[2],
                        phone: values[3],
                        productName: values[4],
                        total: parseFloat(values[5]),
                        status: values[6],
                        createdAt: values[7],
                        updatedAt: values[8]
                    };
                    if (!this.findOrder(order.id)) {
                        this.orders.push(order);
                    }
                }
            });

            this.saveOrders();
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }

    /**
     * Clear all orders (for testing)
     */
    clearAll() {
        this.orders = [];
        this.saveOrders();
    }
}

// Global instance
const orderSystem = new OrderManagementSystem();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderManagementSystem;
}
