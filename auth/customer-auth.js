// ========== CUSTOMER AUTHENTICATION SYSTEM ==========

// Customer storage structure:
// {
//   id: unique-id,
//   username: string,
//   email: string,
//   password: hashed-password,
//   phone: string,
//   createdAt: timestamp,
//   lastLogin: timestamp,
//   orders: [order-ids],
//   isActive: boolean
// }

class CustomerAuth {
    constructor() {
        this.storageKey = 'customers';
        this.sessionKey = 'customerSession';
    }

    /**
     * Register new customer
     */
    register(username, email, password, phone) {
        // Validate input
        if (!this.validateEmail(email)) {
            return { success: false, message: 'Email tidak valid' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password minimal 6 karakter' };
        }

        const customers = this.getAllCustomers();

        // Check if email already exists
        if (customers.some(c => c.email === email)) {
            return { success: false, message: 'Email sudah terdaftar' };
        }

        // Check if username already exists
        if (customers.some(c => c.username === username)) {
            return { success: false, message: 'Username sudah digunakan' };
        }

        // Create new customer
        const newCustomer = {
            id: 'CUST-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            username: username,
            email: email,
            password: this.hashPassword(password),
            phone: phone || '',
            createdAt: new Date().getTime(),
            lastLogin: null,
            orders: [],
            isActive: true,
            avatar: null
        };

        customers.push(newCustomer);
        localStorage.setItem(this.storageKey, JSON.stringify(customers));

        // Log to audit system
        this.logAudit('customer_register', newCustomer.id, `Customer ${username} registered`);

        return { success: true, message: 'Registrasi berhasil', customerId: newCustomer.id };
    }

    /**
     * Login customer
     */
    login(email, password) {
        const customers = this.getAllCustomers();
        const customer = customers.find(c => c.email === email);

        if (!customer) {
            return { success: false, message: 'Email atau password salah' };
        }

        if (!customer.isActive) {
            return { success: false, message: 'Akun ini telah dinonaktifkan' };
        }

        if (!this.verifyPassword(password, customer.password)) {
            return { success: false, message: 'Email atau password salah' };
        }

        // Update last login
        customer.lastLogin = new Date().getTime();
        localStorage.setItem(this.storageKey, JSON.stringify(customers));

        // Create session
        const session = {
            customerId: customer.id,
            username: customer.username,
            email: customer.email,
            loginTime: new Date().getTime()
        };

        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        localStorage.setItem('_customerUpdate_' + customer.id, new Date().getTime());

        // Log to audit system
        this.logAudit('customer_login', customer.id, `Customer ${customer.username} logged in`);

        return { success: true, message: 'Login berhasil', customer: customer };
    }

    /**
     * Logout customer
     */
    logout() {
        const session = this.getSession();
        if (session) {
            this.logAudit('customer_logout', session.customerId, `Customer ${session.username} logged out`);
        }
        sessionStorage.removeItem(this.sessionKey);
        localStorage.removeItem('_customerUpdate');
    }

    /**
     * Get current session
     */
    getSession() {
        const session = sessionStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    /**
     * Check if customer is logged in
     */
    isLoggedIn() {
        return this.getSession() !== null;
    }

    /**
     * Get all customers
     */
    getAllCustomers() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Get customer by ID
     */
    getCustomerById(customerId) {
        const customers = this.getAllCustomers();
        return customers.find(c => c.id === customerId);
    }

    /**
     * Get customer by email
     */
    getCustomerByEmail(email) {
        const customers = this.getAllCustomers();
        return customers.find(c => c.email === email);
    }

    /**
     * Update customer profile
     */
    updateProfile(customerId, data) {
        const customers = this.getAllCustomers();
        const customer = customers.find(c => c.id === customerId);

        if (!customer) {
            return { success: false, message: 'Customer tidak ditemukan' };
        }

        // Update allowed fields
        if (data.phone) customer.phone = data.phone;
        if (data.avatar) customer.avatar = data.avatar;
        if (data.username) customer.username = data.username;

        localStorage.setItem(this.storageKey, JSON.stringify(customers));

        this.logAudit('customer_update_profile', customerId, `Customer profile updated`);

        return { success: true, message: 'Profile updated', customer: customer };
    }

    /**
     * Change password
     */
    changePassword(customerId, oldPassword, newPassword) {
        const customer = this.getCustomerById(customerId);

        if (!customer) {
            return { success: false, message: 'Customer tidak ditemukan' };
        }

        if (!this.verifyPassword(oldPassword, customer.password)) {
            return { success: false, message: 'Password lama salah' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: 'Password minimal 6 karakter' };
        }

        const customers = this.getAllCustomers();
        const idx = customers.findIndex(c => c.id === customerId);
        customers[idx].password = this.hashPassword(newPassword);

        localStorage.setItem(this.storageKey, JSON.stringify(customers));

        this.logAudit('customer_change_password', customerId, 'Customer changed password');

        return { success: true, message: 'Password berhasil diubah' };
    }

    /**
     * Add order to customer
     */
    addOrderToCustomer(customerId, orderId) {
        const customers = this.getAllCustomers();
        const customer = customers.find(c => c.id === customerId);

        if (customer && !customer.orders.includes(orderId)) {
            customer.orders.push(orderId);
            localStorage.setItem(this.storageKey, JSON.stringify(customers));
            return true;
        }
        return false;
    }

    /**
     * Get customer orders
     */
    getCustomerOrders(customerId) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const customer = this.getCustomerById(customerId);
        
        if (!customer) return [];
        
        return orders.filter(order => customer.orders.includes(order.id));
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Simple password hash (for demo - use bcrypt in production)
     */
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(36);
    }

    /**
     * Verify password
     */
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    /**
     * Log audit trail
     */
    logAudit(action, customerId, description) {
        const audit = JSON.parse(localStorage.getItem('auditLog') || '[]');
        
        audit.push({
            id: 'AUDIT-' + Date.now(),
            timestamp: new Date().getTime(),
            action: action,
            customerId: customerId || null,
            description: description,
            ipAddress: 'browser-' + navigator.userAgent.substring(0, 20),
            userAgent: navigator.userAgent
        });

        // Keep only last 1000 entries
        if (audit.length > 1000) {
            audit.shift();
        }

        localStorage.setItem('auditLog', JSON.stringify(audit));
    }

    /**
     * Deactivate customer account
     */
    deactivateAccount(customerId) {
        const customers = this.getAllCustomers();
        const customer = customers.find(c => c.id === customerId);

        if (customer) {
            customer.isActive = false;
            localStorage.setItem(this.storageKey, JSON.stringify(customers));
            this.logAudit('customer_deactivate', customerId, 'Customer account deactivated');
            return true;
        }
        return false;
    }

    /**
     * Export customer data for backup
     */
    exportData() {
        return {
            customers: this.getAllCustomers(),
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize global instance
const customerAuth = new CustomerAuth();
