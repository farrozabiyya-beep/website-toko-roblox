// ========== ADMIN USER MANAGEMENT SYSTEM ==========

class AdminAuth {
    constructor() {
        this.storageKey = 'adminUsers';
        this.sessionKey = 'adminSession';
        this.initDefaultAdmins();
    }

    /**
     * Initialize with default admin if no admins exist
     */
    initDefaultAdmins() {
        const admins = this.getAllAdmins();
        if (admins.length === 0) {
            this.createAdmin('devrobloxstore', 'devstore1230', 'admin@devroblox.store', 'Owner', true);
        }
    }

    /**
     * Create new admin user
     */
    createAdmin(username, password, email, role = 'staff', isActive = true) {
        const admins = this.getAllAdmins();

        // Check if admin exists
        if (admins.some(a => a.username === username || a.email === email)) {
            return { success: false, message: 'Username atau email sudah terdaftar' };
        }

        // Validate role
        const validRoles = ['owner', 'admin', 'staff', 'viewer'];
        if (!validRoles.includes(role.toLowerCase())) {
            return { success: false, message: 'Role tidak valid' };
        }

        const newAdmin = {
            id: 'ADMIN-' + Date.now(),
            username: username,
            email: email,
            password: this.hashPassword(password),
            role: role.toLowerCase(),
            isActive: isActive,
            createdAt: new Date().getTime(),
            lastLogin: null,
            lastModified: new Date().getTime()
        };

        admins.push(newAdmin);
        localStorage.setItem(this.storageKey, JSON.stringify(admins));

        // Log to audit
        const currentAdmin = this.getSession();
        this.logAudit(currentAdmin ? currentAdmin.adminId : 'system', 'admin_create', `Admin ${username} created with role ${role}`);

        return { success: true, message: 'Admin berhasil ditambahkan', adminId: newAdmin.id };
    }

    /**
     * Admin login
     */
    login(username, password) {
        const admins = this.getAllAdmins();
        const admin = admins.find(a => a.username === username);

        if (!admin) {
            this.logAudit('unknown', 'admin_login_failed', `Failed login attempt for username: ${username}`);
            return { success: false, message: 'Username atau password salah' };
        }

        if (!admin.isActive) {
            return { success: false, message: 'Akun admin ini telah dinonaktifkan' };
        }

        if (!this.verifyPassword(password, admin.password)) {
            this.logAudit('unknown', 'admin_login_failed', `Failed login attempt for ${username}`);
            return { success: false, message: 'Username atau password salah' };
        }

        // Update last login
        admin.lastLogin = new Date().getTime();
        localStorage.setItem(this.storageKey, JSON.stringify(admins));

        // Create session
        const session = {
            adminId: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            loginTime: new Date().getTime()
        };

        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));

        // Log successful login
        this.logAudit(admin.id, 'admin_login', `Admin ${admin.username} logged in`);

        return { 
            success: true, 
            message: 'Login berhasil',
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        };
    }

    /**
     * Admin logout
     */
    logout() {
        const session = this.getSession();
        if (session) {
            this.logAudit(session.adminId, 'admin_logout', `Admin ${session.username} logged out`);
        }
        sessionStorage.removeItem(this.sessionKey);
    }

    /**
     * Get current admin session
     */
    getSession() {
        const session = sessionStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    /**
     * Check if admin is logged in
     */
    isLoggedIn() {
        return this.getSession() !== null;
    }

    /**
     * Check if admin has permission
     */
    hasPermission(requiredRole) {
        const session = this.getSession();
        if (!session) return false;

        const roleHierarchy = {
            'owner': 4,
            'admin': 3,
            'staff': 2,
            'viewer': 1
        };

        return (roleHierarchy[session.role] || 0) >= (roleHierarchy[requiredRole] || 0);
    }

    /**
     * Get all admins
     */
    getAllAdmins() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Get admin by ID
     */
    getAdminById(adminId) {
        const admins = this.getAllAdmins();
        return admins.find(a => a.id === adminId);
    }

    /**
     * Update admin
     */
    updateAdmin(adminId, data) {
        const currentSession = this.getSession();

        // Only owner can update admins
        if (!this.hasPermission('owner')) {
            return { success: false, message: 'Anda tidak memiliki izin' };
        }

        const admins = this.getAllAdmins();
        const admin = admins.find(a => a.id === adminId);

        if (!admin) {
            return { success: false, message: 'Admin tidak ditemukan' };
        }

        // Update allowed fields
        if (data.email) admin.email = data.email;
        if (data.role) admin.role = data.role.toLowerCase();
        if (typeof data.isActive === 'boolean') admin.isActive = data.isActive;

        admin.lastModified = new Date().getTime();
        localStorage.setItem(this.storageKey, JSON.stringify(admins));

        this.logAudit(currentSession.adminId, 'admin_update', `Admin ${admin.username} updated`);

        return { success: true, message: 'Admin berhasil diupdate' };
    }

    /**
     * Change password
     */
    changePassword(adminId, oldPassword, newPassword) {
        const admin = this.getAdminById(adminId);

        if (!admin) {
            return { success: false, message: 'Admin tidak ditemukan' };
        }

        if (!this.verifyPassword(oldPassword, admin.password)) {
            return { success: false, message: 'Password lama salah' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: 'Password minimal 6 karakter' };
        }

        const admins = this.getAllAdmins();
        const idx = admins.findIndex(a => a.id === adminId);
        admins[idx].password = this.hashPassword(newPassword);

        localStorage.setItem(this.storageKey, JSON.stringify(admins));

        const session = this.getSession();
        this.logAudit(session.adminId, 'admin_change_password', `Admin ${admin.username} changed password`);

        return { success: true, message: 'Password berhasil diubah' };
    }

    /**
     * Delete admin
     */
    deleteAdmin(adminId) {
        const currentSession = this.getSession();

        // Only owner can delete admins
        if (!this.hasPermission('owner')) {
            return { success: false, message: 'Anda tidak memiliki izin' };
        }

        // Cannot delete self
        if (adminId === currentSession.adminId) {
            return { success: false, message: 'Anda tidak bisa menghapus akun sendiri' };
        }

        const admins = this.getAllAdmins();
        const idx = admins.findIndex(a => a.id === adminId);

        if (idx === -1) {
            return { success: false, message: 'Admin tidak ditemukan' };
        }

        const deletedAdmin = admins[idx];
        admins.splice(idx, 1);
        localStorage.setItem(this.storageKey, JSON.stringify(admins));

        this.logAudit(currentSession.adminId, 'admin_delete', `Admin ${deletedAdmin.username} deleted`);

        return { success: true, message: 'Admin berhasil dihapus' };
    }

    /**
     * Log audit trail
     */
    logAudit(adminId, action, description) {
        const audit = JSON.parse(localStorage.getItem('auditLog') || '[]');

        audit.push({
            id: 'AUDIT-' + Date.now(),
            timestamp: new Date().getTime(),
            adminId: adminId,
            action: action,
            description: description,
            userAgent: navigator.userAgent
        });

        // Keep only last 5000 entries
        if (audit.length > 5000) {
            audit.splice(0, audit.length - 5000);
        }

        localStorage.setItem('auditLog', JSON.stringify(audit));
    }

    /**
     * Get audit log
     */
    getAuditLog(limit = 100, filter = {}) {
        const audit = JSON.parse(localStorage.getItem('auditLog') || '[]');
        let filtered = audit;

        if (filter.adminId) {
            filtered = filtered.filter(a => a.adminId === filter.adminId);
        }

        if (filter.action) {
            filtered = filtered.filter(a => a.action === filter.action);
        }

        if (filter.startDate && filter.endDate) {
            filtered = filtered.filter(a => 
                a.timestamp >= filter.startDate && a.timestamp <= filter.endDate
            );
        }

        return filtered.slice(-limit).reverse();
    }

    /**
     * Hash password
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
}

// Initialize global instance
const adminAuth = new AdminAuth();
