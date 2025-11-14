// ========== DASHBOARD STATISTICS SYSTEM ==========

class DashboardStats {
    /**
     * Get today's orders count
     */
    static getTodayOrdersCount() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

        return orders.filter(o => {
            const orderTime = typeof o.createdAt === 'number' ? o.createdAt : new Date(o.createdAt).getTime();
            return orderTime >= startOfDay && orderTime < endOfDay;
        }).length;
    }

    /**
     * Get total revenue (all time)
     */
    static getTotalRevenue() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders
            .filter(o => o.status === 'Selesai')
            .reduce((sum, o) => sum + (o.price || o.totalPrice || 0), 0);
    }

    /**
     * Get total revenue for today
     */
    static getTodayRevenue() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

        return orders
            .filter(o => {
                const orderTime = typeof o.createdAt === 'number' ? o.createdAt : new Date(o.createdAt).getTime();
                return orderTime >= startOfDay && orderTime < endOfDay && o.status === 'Selesai';
            })
            .reduce((sum, o) => sum + (o.price || o.totalPrice || 0), 0);
    }

    /**
     * Get total orders count
     */
    static getTotalOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders.length;
    }

    /**
     * Get most popular product
     */
    static getMostPopularProduct() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const productCount = {};

        orders.forEach(o => {
            const item = o.item || 'Unknown';
            productCount[item] = (productCount[item] || 0) + 1;
        });

        let mostPopular = { name: 'Tidak ada data', count: 0 };
        for (const [item, count] of Object.entries(productCount)) {
            if (count > mostPopular.count) {
                mostPopular = { name: item, count: count };
            }
        }

        return mostPopular.name;
    }

    /**
     * Get pending orders
     */
    static getPendingOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders.filter(o => o.status === 'Pending' || o.status === 'pending').length;
    }

    /**
     * Get completed orders
     */
    static getCompletedOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders.filter(o => o.status === 'Selesai').length;
    }

    /**
     * Get total customers
     */
    static getTotalCustomers() {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        return customers.length;
    }

    /**
     * Get total active customers
     */
    static getActiveCustomers() {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        return customers.filter(c => c.isActive).length;
    }

    /**
     * Get orders by status
     */
    static getOrdersByStatus() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const status = {
            pending: 0,
            diproses: 0,
            selesai: 0,
            dibatalkan: 0
        };

        orders.forEach(o => {
            const s = (o.status || 'Pending').toLowerCase();
            if (s === 'pending') status.pending++;
            else if (s === 'diproses') status.diproses++;
            else if (s === 'selesai') status.selesai++;
            else if (s === 'dibatalkan') status.dibatalkan++;
        });

        return status;
    }

    /**
     * Get sales data by date (last 7 days)
     */
    static getSalesByDate(days = 7) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const data = {};

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            data[dateStr] = { orders: 0, revenue: 0 };
        }

        orders.forEach(o => {
            const orderTime = typeof o.createdAt === 'number' ? new Date(o.createdAt) : new Date(o.createdAt);
            const dateStr = orderTime.toISOString().split('T')[0];

            if (data[dateStr]) {
                data[dateStr].orders++;
                if (o.status === 'Selesai') {
                    data[dateStr].revenue += (o.price || o.totalPrice || 0);
                }
            }
        });

        return data;
    }

    /**
     * Get product statistics
     */
    static getProductStats() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const products = JSON.parse(localStorage.getItem('robloxAccounts') || '[]');
        
        const stats = [];

        products.forEach(product => {
            const productOrders = orders.filter(o => o.item === product.profile || o.item === product.username);
            const revenue = productOrders
                .filter(o => o.status === 'Selesai')
                .reduce((sum, o) => sum + (o.price || 0), 0);

            stats.push({
                name: product.profile || product.username,
                orders: productOrders.length,
                revenue: revenue,
                stock: product.stock || 0,
                price: product.price || 0
            });
        });

        return stats.sort((a, b) => b.orders - a.orders);
    }

    /**
     * Get top customers
     */
    static getTopCustomers(limit = 10) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        
        const customerSpending = {};

        orders.forEach(o => {
            const email = o.username || o.email || 'Unknown';
            if (!customerSpending[email]) {
                customerSpending[email] = { orders: 0, spent: 0 };
            }
            customerSpending[email].orders++;
            customerSpending[email].spent += (o.price || o.totalPrice || 0);
        });

        return Object.entries(customerSpending)
            .map(([email, data]) => ({
                email: email,
                orders: data.orders,
                spent: data.spent,
                average: Math.round(data.spent / data.orders)
            }))
            .sort((a, b) => b.spent - a.spent)
            .slice(0, limit);
    }

    /**
     * Get monthly revenue
     */
    static getMonthlyRevenue() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const monthly = {};

        orders.forEach(o => {
            if (o.status !== 'Selesai') return;

            const orderTime = typeof o.createdAt === 'number' ? new Date(o.createdAt) : new Date(o.createdAt);
            const monthKey = orderTime.toISOString().substring(0, 7); // YYYY-MM

            monthly[monthKey] = (monthly[monthKey] || 0) + (o.price || o.totalPrice || 0);
        });

        return monthly;
    }

    /**
     * Get conversion rate (orders / visitors estimate)
     */
    static getConversionRate() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        
        if (customers.length === 0) return 0;
        
        return ((orders.length / customers.length) * 100).toFixed(2);
    }

    /**
     * Get all statistics at once
     */
    static getAllStats() {
        return {
            todayOrders: this.getTodayOrdersCount(),
            todayRevenue: this.getTodayRevenue(),
            totalOrders: this.getTotalOrders(),
            totalRevenue: this.getTotalRevenue(),
            totalCustomers: this.getTotalCustomers(),
            activeCustomers: this.getActiveCustomers(),
            mostPopularProduct: this.getMostPopularProduct(),
            pendingOrders: this.getPendingOrders(),
            completedOrders: this.getCompletedOrders(),
            ordersByStatus: this.getOrdersByStatus(),
            salesByDate: this.getSalesByDate(7),
            productStats: this.getProductStats(),
            topCustomers: this.getTopCustomers(5),
            monthlyRevenue: this.getMonthlyRevenue(),
            conversionRate: this.getConversionRate()
        };
    }
}
