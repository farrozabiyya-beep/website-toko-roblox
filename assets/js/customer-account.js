/**
 * Customer Account Manager
 * Mengelola profil, pesanan, wishlist, dan notifikasi pelanggan
 */

class CustomerAccountManager {
    constructor() {
        this.currentCustomer = null;
        this.init();
    }

    init() {
        this.loadCustomerData();
        this.setupEventListeners();
        this.displayProfile();
        this.displayOrders();
        this.displayWishlist();
        this.displayNotifications();
    }

    loadCustomerData() {
        const session = customerAuth.getSession();
        if (!session) {
            window.location.href = '../auth/customer-login.html';
            return;
        }
        this.currentCustomer = session;
    }

    setupEventListeners() {
        // Profile form submit
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Change password form
        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => this.handleChangePassword(e));
        }

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                document.getElementById('navMenu').classList.toggle('active');
            });
        }
    }

    displayProfile() {
        const customer = this.currentCustomer;
        
        document.getElementById('profileUsername').textContent = customer.username || 'User';
        document.getElementById('profileEmail').textContent = customer.email || '';
        
        const joinDate = new Date(customer.createdAt);
        document.getElementById('profileJoinDate').textContent = 
            `Member sejak ${joinDate.toLocaleDateString('id-ID')}`;

        // Set avatar initial
        const initial = (customer.username || 'U')[0].toUpperCase();
        document.getElementById('profileAvatar').textContent = initial;

        // Load form data
        document.getElementById('fullname').value = customer.fullname || '';
        document.getElementById('robloxUsername').value = customer.robloxUsername || '';
        document.getElementById('email').value = customer.email || '';
        document.getElementById('phone').value = customer.phone || '';
        document.getElementById('bio').value = customer.bio || '';

        // Email verification status
        const verifyStatus = document.getElementById('emailVerifyStatus');
        if (customer.emailVerified) {
            verifyStatus.textContent = '✅ Email terverifikasi';
            verifyStatus.style.color = 'var(--primary-color)';
        }
    }

    displayOrders() {
        const orders = customerAuth.getCustomerOrders(this.currentCustomer.id);
        const orderHistory = document.getElementById('orderHistory');

        if (!orders || orders.length === 0) {
            orderHistory.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fas fa-inbox"></i></div>
                    <p>Belum ada pesanan</p>
                </div>
            `;
            return;
        }

        orderHistory.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Order #{order.id}</span>
                    <span class="order-status status-${order.status.toLowerCase()}">
                        ${this.formatStatus(order.status)}
                    </span>
                </div>
                <div class="order-details">
                    <div class="order-detail-item">
                        <span class="order-detail-label">Tanggal</span>
                        <span class="order-detail-value">${new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div class="order-detail-item">
                        <span class="order-detail-label">Total</span>
                        <span class="order-detail-value">Rp${order.total?.toLocaleString('id-ID') || 0}</span>
                    </div>
                    <div class="order-detail-item">
                        <span class="order-detail-label">Produk</span>
                        <span class="order-detail-value">${order.productName || 'N/A'}</span>
                    </div>
                    <div class="order-detail-item">
                        <span class="order-detail-label">Metode</span>
                        <span class="order-detail-value">${order.paymentMethod || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '{}')[this.currentCustomer.id] || [];
        const wishlistGrid = document.getElementById('wishlistGrid');

        if (wishlist.length === 0) {
            wishlistGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-icon"><i class="fas fa-heart"></i></div>
                    <p>Wishlist Anda kosong</p>
                </div>
            `;
            return;
        }

        wishlistGrid.innerHTML = wishlist.map(item => `
            <div class="wishlist-item">
                <div class="wishlist-image">
                    <i class="fas fa-gamepad"></i>
                </div>
                <div class="wishlist-info">
                    <div class="wishlist-title">${item.name}</div>
                    <div class="wishlist-price">Rp${item.price?.toLocaleString('id-ID') || 0}</div>
                    <div class="wishlist-actions">
                        <button class="btn-order" onclick="window.location.href='../pages/product.html'">
                            <i class="fas fa-shopping-cart"></i> Beli
                        </button>
                        <button class="btn-remove" onclick="removeFromWishlist('${item.id}')">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayNotifications() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '{}')[this.currentCustomer.id] || [];
        const notificationsList = document.getElementById('notificationsList');

        // Update badge
        const unreadCount = notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notifBadge');
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        }

        if (notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fas fa-bell"></i></div>
                    <p>Tidak ada notifikasi</p>
                </div>
            `;
            return;
        }

        notificationsList.innerHTML = notifications.map(notif => `
            <div class="order-card" style="border-left-color: ${notif.read ? '#cccccc' : 'var(--primary-color)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>${notif.title}</strong>
                    ${notif.read ? '' : '<span style="background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">Baru</span>'}
                </div>
                <p style="margin-bottom: 10px; color: var(--text-secondary);">${notif.message}</p>
                <small style="color: var(--text-secondary);">${new Date(notif.createdAt).toLocaleDateString('id-ID')}</small>
            </div>
        `).join('');

        // Mark as read
        notifications.forEach(n => n.read = true);
        const allNotif = JSON.parse(localStorage.getItem('notifications') || '{}');
        allNotif[this.currentCustomer.id] = notifications;
        localStorage.setItem('notifications', JSON.stringify(allNotif));
    }

    handleProfileUpdate(e) {
        e.preventDefault();

        const updatedData = {
            fullname: document.getElementById('fullname').value,
            robloxUsername: document.getElementById('robloxUsername').value,
            phone: document.getElementById('phone').value,
            bio: document.getElementById('bio').value
        };

        customerAuth.updateProfile(this.currentCustomer.id, updatedData);
        
        showNotification('success', 'Profil berhasil diperbarui!');
        this.loadCustomerData();
        this.displayProfile();
    }

    handleChangePassword(e) {
        e.preventDefault();

        const oldPass = document.getElementById('oldPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        if (newPass !== confirmPass) {
            showNotification('error', 'Password baru tidak cocok!');
            return;
        }

        if (newPass.length < 6) {
            showNotification('error', 'Password minimal 6 karakter!');
            return;
        }

        const result = customerAuth.changePassword(this.currentCustomer.id, oldPass, newPass);
        
        if (result.success) {
            showNotification('success', 'Password berhasil diubah!');
            closeModal('changePasswordModal');
            document.getElementById('changePasswordForm').reset();
        } else {
            showNotification('error', result.message || 'Gagal mengubah password!');
        }
    }

    formatStatus(status) {
        const statusMap = {
            'pending': '⏳ Pending',
            'completed': '✅ Selesai',
            'failed': '❌ Gagal'
        };
        return statusMap[status.toLowerCase()] || status;
    }

    addNotification(title, message, type = 'info') {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
        if (!notifications[this.currentCustomer.id]) {
            notifications[this.currentCustomer.id] = [];
        }

        notifications[this.currentCustomer.id].unshift({
            id: Date.now(),
            title,
            message,
            type,
            read: false,
            createdAt: Date.now()
        });

        localStorage.setItem('notifications', JSON.stringify(notifications));
        this.displayNotifications();
    }
}

// Global functions
let accountManager;

function initAccountManager() {
    accountManager = new CustomerAccountManager();
}

function switchSection(sectionName, button) {
    // Remove active class from all buttons
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
        
        // Refresh data ketika section ditampilkan
        if (sectionName === 'orders') accountManager.displayOrders();
        if (sectionName === 'wishlist') accountManager.displayWishlist();
        if (sectionName === 'notifications') accountManager.displayNotifications();
    }
}

function handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        customerAuth.logout();
        window.location.href = '../index.html';
    }
}

function openChangePassword() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function sendVerification() {
    showNotification('info', 'Link verifikasi telah dikirim ke email Anda!');
}

function requestDeleteAccount() {
    if (confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!')) {
        if (confirm('Konfirmasi lagi: Semua data Anda akan dihapus permanen!')) {
            customerAuth.deleteAccount(accountManager.currentCustomer.id);
            showNotification('success', 'Akun Anda berhasil dihapus!');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        }
    }
}

function removeFromWishlist(itemId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '{}');
    if (wishlist[accountManager.currentCustomer.id]) {
        wishlist[accountManager.currentCustomer.id] = 
            wishlist[accountManager.currentCustomer.id].filter(item => item.id !== itemId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        accountManager.displayWishlist();
        showNotification('success', 'Item dihapus dari wishlist!');
    }
}

// Notification helper (dari theme-notification.js jika ada)
function showNotification(type, message) {
    if (window.NotificationManager) {
        window.NotificationManager.show(type, message);
    } else {
        alert(message);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAccountManager);
