// ========== DARK MODE & THEME SYSTEM ==========

class ThemeManager {
    constructor() {
        this.storageKey = 'themePreference';
        this.darkModeClass = 'dark-mode';
        this.initTheme();
    }

    /**
     * Initialize theme from storage
     */
    initTheme() {
        const savedTheme = localStorage.getItem(this.storageKey) || 'light';
        this.setTheme(savedTheme);
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add(this.darkModeClass);
            localStorage.setItem(this.storageKey, 'dark');
        } else {
            document.documentElement.classList.remove(this.darkModeClass);
            localStorage.setItem(this.storageKey, 'light');
        }
        this.applyThemeColors(theme);
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return document.documentElement.classList.contains(this.darkModeClass) ? 'dark' : 'light';
    }

    /**
     * Apply theme colors
     */
    applyThemeColors(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#1a1a1a');
            root.style.setProperty('--bg-secondary', '#2d2d2d');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b0b0b0');
            root.style.setProperty('--border-color', '#404040');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8f9fa');
            root.style.setProperty('--text-primary', '#212529');
            root.style.setProperty('--text-secondary', '#6c757d');
            root.style.setProperty('--border-color', '#dee2e6');
        }
    }
}

// ========== NOTIFICATION SYSTEM ==========

class NotificationManager {
    /**
     * Show toast notification
     */
    static showToast(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            'success': '✓',
            'error': '✕',
            'warning': '⚠',
            'info': 'ℹ'
        };
        
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#00bfff'
        };

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; color: white;">
                <span style="font-size: 18px; font-weight: bold;">${icons[type] || '•'}</span>
                <span>${message}</span>
                <button style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    margin-left: 10px;
                ">×</button>
            </div>
        `;

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: ${colors[type]};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;

        const closeBtn = toast.querySelector('button');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });

        document.body.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    toast.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }

        return toast;
    }

    /**
     * Show alert dialog
     */
    static showAlert(message, title = 'Notifikasi') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'alert-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            `;

            modal.innerHTML = `
                <div style="
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                    max-width: 400px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                ">
                    <h2 style="margin: 0 0 15px 0; color: #0047ab;">${title}</h2>
                    <p style="margin: 0 0 25px 0; color: #333; line-height: 1.5;">${message}</p>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn-alert-ok" style="
                            padding: 10px 20px;
                            background: #0047ab;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">OK</button>
                    </div>
                </div>
            `;

            const btn = modal.querySelector('.btn-alert-ok');
            btn.addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });

            document.body.appendChild(modal);
        });
    }

    /**
     * Show confirm dialog
     */
    static showConfirm(message, title = 'Konfirmasi') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'confirm-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            `;

            modal.innerHTML = `
                <div style="
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                    max-width: 400px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                ">
                    <h2 style="margin: 0 0 15px 0; color: #0047ab;">${title}</h2>
                    <p style="margin: 0 0 25px 0; color: #333; line-height: 1.5;">${message}</p>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn-confirm-cancel" style="
                            padding: 10px 20px;
                            background: #6c757d;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Batal</button>
                        <button class="btn-confirm-ok" style="
                            padding: 10px 20px;
                            background: #0047ab;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Setuju</button>
                    </div>
                </div>
            `;

            const btnCancel = modal.querySelector('.btn-confirm-cancel');
            const btnOk = modal.querySelector('.btn-confirm-ok');

            btnCancel.addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });

            btnOk.addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });

            document.body.appendChild(modal);
        });
    }

    /**
     * Show order notification
     */
    static showOrderNotification(order) {
        const message = `Pesanan baru dari ${order.username || order.name} untuk ${order.item}`;
        this.showToast(message, 'success', 6000);

        // Play notification sound if available
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
            audio.play().catch(() => {});
        } catch (e) {}
    }

    /**
     * Show error notification
     */
    static showError(message) {
        return this.showToast(message, 'error', 5000);
    }

    /**
     * Show success notification
     */
    static showSuccess(message) {
        return this.showToast(message, 'success', 3000);
    }

    /**
     * Show warning notification
     */
    static showWarning(message) {
        return this.showToast(message, 'warning', 4000);
    }

    /**
     * Show info notification
     */
    static showInfo(message) {
        return this.showToast(message, 'info', 3000);
    }
}

// Add CSS animations to head
const style = document.createElement('style');
style.textContent = `
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

    /* Dark mode variables */
    :root {
        --bg-primary: #ffffff;
        --bg-secondary: #f8f9fa;
        --text-primary: #212529;
        --text-secondary: #6c757d;
        --border-color: #dee2e6;
    }

    body.dark-mode {
        background: var(--bg-primary) !important;
        color: var(--text-primary) !important;
    }

    body.dark-mode .admin-content {
        background: var(--bg-secondary) !important;
        border-color: var(--border-color) !important;
        color: var(--text-primary) !important;
    }

    body.dark-mode .modal-content {
        background: var(--bg-secondary) !important;
        color: var(--text-primary) !important;
    }

    body.dark-mode .data-table table {
        background: var(--bg-secondary) !important;
        color: var(--text-primary) !important;
    }

    body.dark-mode .data-table thead {
        background: var(--bg-primary) !important;
        border-color: var(--border-color) !important;
    }

    body.dark-mode .data-table td,
    body.dark-mode .data-table th {
        border-color: var(--border-color) !important;
        color: var(--text-primary) !important;
    }

    body.dark-mode .form-group input,
    body.dark-mode .form-group select,
    body.dark-mode .form-group textarea {
        background: var(--bg-primary) !important;
        color: var(--text-primary) !important;
        border-color: var(--border-color) !important;
    }

    body.dark-mode .login-box {
        background: var(--bg-secondary) !important;
        color: var(--text-primary) !important;
    }
`;
document.head.appendChild(style);

// Initialize theme manager
const themeManager = new ThemeManager();
