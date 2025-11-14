/**
 * Notification System
 * Sistem notifikasi lengkap untuk update pesanan dan info penting
 */

class NotificationSystem {
    constructor() {
        this.storageKey = 'notifications';
        this.notifications = this.loadNotifications();
        this.init();
    }

    init() {
        this.createNotificationCenter();
    }

    createNotificationCenter() {
        if (document.getElementById('notificationCenter')) return;

        const center = document.createElement('div');
        center.id = 'notificationCenter';
        center.innerHTML = `
            <style>
                #notificationContainer {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 9999;
                    pointer-events: none;
                }

                .notification {
                    background: white;
                    border-radius: 10px;
                    padding: 16px 20px;
                    margin-bottom: 10px;
                    box-shadow: 0 5px 25px rgba(0,0,0,0.15);
                    animation: slideIn 0.3s ease;
                    pointer-events: all;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    max-width: 350px;
                    min-width: 300px;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(400px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideOut {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(400px);
                    }
                }

                .notification.closing {
                    animation: slideOut 0.3s ease;
                }

                .notification-icon {
                    font-size: 1.5rem;
                    min-width: 24px;
                    text-align: center;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-title {
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: #333;
                }

                .notification-message {
                    font-size: 0.9rem;
                    color: #666;
                    line-height: 1.4;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 0;
                    margin-left: 10px;
                    transition: color 0.2s ease;
                }

                .notification-close:hover {
                    color: #333;
                }

                .notification-progress {
                    height: 3px;
                    background: #e0e0e0;
                    margin-top: 10px;
                    border-radius: 2px;
                    overflow: hidden;
                }

                .notification-progress-bar {
                    height: 100%;
                    animation: progressBar 4s linear;
                }

                @keyframes progressBar {
                    from { width: 100%; }
                    to { width: 0%; }
                }

                /* Types */
                .notification.success {
                    border-left: 4px solid #28a745;
                }

                .notification.success .notification-icon {
                    color: #28a745;
                }

                .notification.success .notification-progress-bar {
                    background: #28a745;
                }

                .notification.error {
                    border-left: 4px solid #dc3545;
                }

                .notification.error .notification-icon {
                    color: #dc3545;
                }

                .notification.error .notification-progress-bar {
                    background: #dc3545;
                }

                .notification.warning {
                    border-left: 4px solid #ffc107;
                }

                .notification.warning .notification-icon {
                    color: #ffc107;
                }

                .notification.warning .notification-progress-bar {
                    background: #ffc107;
                }

                .notification.info {
                    border-left: 4px solid #17a2b8;
                }

                .notification.info .notification-icon {
                    color: #17a2b8;
                }

                .notification.info .notification-progress-bar {
                    background: #17a2b8;
                }

                .notification.order-update {
                    border-left: 4px solid #667eea;
                }

                .notification.order-update .notification-icon {
                    color: #667eea;
                }

                .notification.order-update .notification-progress-bar {
                    background: #667eea;
                }

                /* Dark mode */
                .dark-mode .notification {
                    background: #2a2a2a;
                    color: white;
                }

                .dark-mode .notification-title {
                    color: white;
                }

                .dark-mode .notification-message {
                    color: #ccc;
                }

                @media (max-width: 600px) {
                    #notificationContainer {
                        left: 10px;
                        right: 10px;
                    }

                    .notification {
                        max-width: 100%;
                        min-width: auto;
                    }
                }
            </style>

            <div id="notificationContainer"></div>
        `;

        document.body.appendChild(center);
    }

    /**
     * Show notification
     */
    show(title, message, type = 'info', duration = 4000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        const id = `notif-${Date.now()}`;
        notification.id = id;

        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-times-circle"></i>',
            warning: '<i class="fas fa-exclamation-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            'order-update': '<i class="fas fa-truck"></i>'
        };

        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons['info']}</div>
            <div class="notification-content">
                <div class="notification-title">${this.escapeHTML(title)}</div>
                <div class="notification-message">${this.escapeHTML(message)}</div>
                <div class="notification-progress">
                    <div class="notification-progress-bar"></div>
                </div>
            </div>
            <button class="notification-close" onclick="document.getElementById('${id}').remove()">
                ×
            </button>
        `;

        container.appendChild(notification);

        // Auto close
        if (duration > 0) {
            setTimeout(() => {
                if (document.getElementById(id)) {
                    notification.classList.add('closing');
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }

        return id;
    }

    /**
     * Order update notification
     */
    notifyOrderUpdate(orderId, status, message) {
        const statusText = {
            'pending': '⏳ Pending',
            'processing': '⚙️ Diproses',
            'completed': '✅ Selesai',
            'failed': '❌ Gagal'
        };

        this.show(
            `Pesanan ${statusText[status]}`,
            `Pesanan ${orderId}: ${message}`,
            'order-update',
            5000
        );

        this.saveNotification({
            title: `Pesanan ${statusText[status]}`,
            message: `Pesanan ${orderId}: ${message}`,
            type: 'order-update',
            timestamp: Date.now(),
            read: false
        });
    }

    /**
     * Success notification
     */
    success(title, message, duration = 4000) {
        return this.show(title, message, 'success', duration);
    }

    /**
     * Error notification
     */
    error(title, message, duration = 4000) {
        return this.show(title, message, 'error', duration);
    }

    /**
     * Warning notification
     */
    warning(title, message, duration = 4000) {
        return this.show(title, message, 'warning', duration);
    }

    /**
     * Info notification
     */
    info(title, message, duration = 4000) {
        return this.show(title, message, 'info', duration);
    }

    /**
     * Load notifications from storage
     */
    loadNotifications() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Save notification to storage
     */
    saveNotification(notification) {
        this.notifications.unshift({
            id: Date.now(),
            ...notification
        });

        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    }

    /**
     * Get unread count
     */
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    /**
     * Mark as read
     */
    markAsRead(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
        }
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        this.notifications = [];
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Escape HTML
     */
    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}

// Global instance
const NotificationManager = new NotificationSystem();

// Override global show function
if (!window.showNotification) {
    window.showNotification = (type, message) => {
        const titles = {
            success: 'Sukses',
            error: 'Error',
            warning: 'Peringatan',
            info: 'Informasi'
        };
        NotificationManager.show(titles[type] || 'Notifikasi', message, type);
    };
}
