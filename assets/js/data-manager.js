// ========== SEARCH & FILTER & EXPORT SYSTEM ==========

class DataManager {
    /**
     * Search orders
     */
    static searchOrders(query) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const lowerQuery = query.toLowerCase();

        return orders.filter(o =>
            (o.id && o.id.toLowerCase().includes(lowerQuery)) ||
            (o.username && o.username.toLowerCase().includes(lowerQuery)) ||
            (o.name && o.name.toLowerCase().includes(lowerQuery)) ||
            (o.item && o.item.toLowerCase().includes(lowerQuery)) ||
            (o.whatsapp && o.whatsapp.includes(query)) ||
            (o.phone && o.phone.includes(query))
        );
    }

    /**
     * Filter orders by status
     */
    static filterOrdersByStatus(status) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders.filter(o => (o.status || 'Pending').toLowerCase() === status.toLowerCase());
    }

    /**
     * Filter orders by date range
     */
    static filterOrdersByDateRange(startDate, endDate) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime() + 86400000; // Add 1 day

        return orders.filter(o => {
            const orderTime = typeof o.createdAt === 'number' ? o.createdAt : new Date(o.createdAt).getTime();
            return orderTime >= start && orderTime <= end;
        });
    }

    /**
     * Search customers
     */
    static searchCustomers(query) {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const lowerQuery = query.toLowerCase();

        return customers.filter(c =>
            (c.username && c.username.toLowerCase().includes(lowerQuery)) ||
            (c.email && c.email.toLowerCase().includes(lowerQuery)) ||
            (c.phone && c.phone.includes(query))
        );
    }

    /**
     * Search products
     */
    static searchProducts(query) {
        const products = JSON.parse(localStorage.getItem('robloxAccounts') || '[]');
        const lowerQuery = query.toLowerCase();

        return products.filter(p =>
            (p.profile && p.profile.toLowerCase().includes(lowerQuery)) ||
            (p.username && p.username.toLowerCase().includes(lowerQuery)) ||
            (p.description && p.description.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Search promos
     */
    static searchPromos(query) {
        const promos = JSON.parse(localStorage.getItem('promos') || '[]');
        const lowerQuery = query.toLowerCase();

        return promos.filter(p =>
            (p.code && p.code.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Advanced filter for orders
     */
    static advancedFilterOrders(filters) {
        let results = JSON.parse(localStorage.getItem('orders') || '[]');

        if (filters.status) {
            results = results.filter(o => (o.status || 'Pending').toLowerCase() === filters.status.toLowerCase());
        }

        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate).getTime();
            const end = new Date(filters.endDate).getTime() + 86400000;
            results = results.filter(o => {
                const orderTime = typeof o.createdAt === 'number' ? o.createdAt : new Date(o.createdAt).getTime();
                return orderTime >= start && orderTime <= end;
            });
        }

        if (filters.minPrice || filters.maxPrice) {
            const min = filters.minPrice || 0;
            const max = filters.maxPrice || Infinity;
            results = results.filter(o => {
                const price = o.price || o.totalPrice || 0;
                return price >= min && price <= max;
            });
        }

        if (filters.searchQuery) {
            const lowerQuery = filters.searchQuery.toLowerCase();
            results = results.filter(o =>
                (o.id && o.id.toLowerCase().includes(lowerQuery)) ||
                (o.username && o.username.toLowerCase().includes(lowerQuery)) ||
                (o.item && o.item.toLowerCase().includes(lowerQuery))
            );
        }

        return results;
    }

    /**
     * Export to CSV
     */
    static exportToCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) {
            alert('Tidak ada data untuk diexport');
            return;
        }

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes if contains comma
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Export orders to CSV
     */
    static exportOrdersToCSV(orders = null) {
        const data = orders || JSON.parse(localStorage.getItem('orders') || '[]');
        const formatted = data.map(o => ({
            'ID Pesanan': o.id || '',
            'Username': o.username || o.name || '',
            'Item': o.item || '',
            'Harga': o.price || o.totalPrice || 0,
            'Status': o.status || 'Pending',
            'WhatsApp': o.whatsapp || o.phone || '',
            'Tanggal': o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : ''
        }));

        this.exportToCSV(formatted, `orders_${new Date().toISOString().split('T')[0]}.csv`);
    }

    /**
     * Export customers to CSV
     */
    static exportCustomersToCSV(customers = null) {
        const data = customers || JSON.parse(localStorage.getItem('customers') || '[]');
        const formatted = data.map(c => ({
            'Username': c.username || '',
            'Email': c.email || '',
            'Phone': c.phone || '',
            'Status': c.isActive ? 'Aktif' : 'Nonaktif',
            'Jumlah Pesanan': c.orders ? c.orders.length : 0,
            'Tanggal Daftar': c.createdAt ? new Date(c.createdAt).toLocaleDateString('id-ID') : ''
        }));

        this.exportToCSV(formatted, `customers_${new Date().toISOString().split('T')[0]}.csv`);
    }

    /**
     * Export products to CSV
     */
    static exportProductsToCSV(products = null) {
        const data = products || JSON.parse(localStorage.getItem('robloxAccounts') || '[]');
        const formatted = data.map(p => ({
            'Profil': p.profile || '',
            'Username': p.username || '',
            'Harga': p.price || 0,
            'Stok': p.stock || 0,
            'Deskripsi': p.description || ''
        }));

        this.exportToCSV(formatted, `products_${new Date().toISOString().split('T')[0]}.csv`);
    }

    /**
     * Export to JSON
     */
    static exportToJSON(data, filename = 'export.json') {
        if (!data) {
            alert('Tidak ada data untuk diexport');
            return;
        }

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Backup all data
     */
    static backupAllData() {
        const backup = {
            timestamp: new Date().toISOString(),
            orders: JSON.parse(localStorage.getItem('orders') || '[]'),
            customers: JSON.parse(localStorage.getItem('customers') || '[]'),
            products: JSON.parse(localStorage.getItem('robloxAccounts') || '[]'),
            promos: JSON.parse(localStorage.getItem('promos') || '[]'),
            flashSales: JSON.parse(localStorage.getItem('flashSales') || '[]'),
            auditLog: JSON.parse(localStorage.getItem('auditLog') || '[]')
        };

        this.exportToJSON(backup, `backup_${new Date().toISOString().split('T')[0]}.json`);
        return true;
    }

    /**
     * Restore from JSON backup
     */
    static restoreFromBackup(jsonData) {
        try {
            const backup = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            if (!backup.timestamp) {
                throw new Error('Format backup tidak valid');
            }

            if (backup.orders) localStorage.setItem('orders', JSON.stringify(backup.orders));
            if (backup.customers) localStorage.setItem('customers', JSON.stringify(backup.customers));
            if (backup.products) localStorage.setItem('robloxAccounts', JSON.stringify(backup.products));
            if (backup.promos) localStorage.setItem('promos', JSON.stringify(backup.promos));
            if (backup.flashSales) localStorage.setItem('flashSales', JSON.stringify(backup.flashSales));

            // Log restore action
            if (window.adminAuth) {
                const session = adminAuth.getSession();
                adminAuth.logAudit(session ? session.adminId : 'system', 'backup_restore', `Backup restored from ${backup.timestamp}`);
            }

            return { success: true, message: 'Data berhasil dipulihkan' };
        } catch (e) {
            return { success: false, message: 'Error saat restore: ' + e.message };
        }
    }

    /**
     * Sort data
     */
    static sortData(data, field, direction = 'asc') {
        const sorted = [...data];
        sorted.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            // Handle dates
            if (typeof aVal === 'object' && aVal instanceof Date) {
                aVal = aVal.getTime();
                bVal = bVal.getTime();
            }

            // Handle numbers
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }

            // Handle strings
            const aStr = String(aVal).toLowerCase();
            const bStr = String(bVal).toLowerCase();

            if (direction === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });

        return sorted;
    }
}
