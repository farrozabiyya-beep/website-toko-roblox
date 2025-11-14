/**
 * Wishlist/Favorites System
 * Mengelola wishlist produk favorit pelanggan
 */

class WishlistManager {
    constructor() {
        this.storageKey = 'wishlist';
        this.listeners = [];
    }

    /**
     * Add item to wishlist
     */
    addToWishlist(item) {
        const wishlist = this.getWishlist();
        
        // Check if item already exists
        if (wishlist.find(w => w.id === item.id)) {
            return { success: false, message: 'Item sudah ada di wishlist' };
        }

        wishlist.push({
            id: item.id || Date.now(),
            name: item.name,
            price: item.price,
            image: item.image || null,
            link: item.link || null,
            category: item.category || 'product',
            addedAt: Date.now()
        });

        this.saveWishlist(wishlist);
        return { success: true, message: 'Ditambahkan ke wishlist' };
    }

    /**
     * Remove item from wishlist
     */
    removeFromWishlist(itemId) {
        let wishlist = this.getWishlist();
        wishlist = wishlist.filter(item => item.id !== itemId);
        this.saveWishlist(wishlist);
        return { success: true };
    }

    /**
     * Get all wishlist items
     */
    getWishlist() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Check if item is in wishlist
     */
    isInWishlist(itemId) {
        return this.getWishlist().some(item => item.id === itemId);
    }

    /**
     * Get wishlist count
     */
    getWishlistCount() {
        return this.getWishlist().length;
    }

    /**
     * Clear all wishlist
     */
    clearWishlist() {
        this.saveWishlist([]);
        return { success: true };
    }

    /**
     * Save wishlist to localStorage
     */
    saveWishlist(wishlist) {
        localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
        this.notifyListeners();
    }

    /**
     * Subscribe to wishlist changes
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Notify all listeners
     */
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.getWishlist()));
    }

    /**
     * Export wishlist as JSON
     */
    exportWishlist() {
        const wishlist = this.getWishlist();
        const dataStr = JSON.stringify(wishlist, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wishlist-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import wishlist from JSON
     */
    importWishlist(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const wishlist = JSON.parse(e.target.result);
                    if (Array.isArray(wishlist)) {
                        this.saveWishlist(wishlist);
                        resolve({ success: true, message: 'Wishlist berhasil diimpor' });
                    } else {
                        reject({ success: false, message: 'Format file tidak valid' });
                    }
                } catch (error) {
                    reject({ success: false, message: 'Gagal membaca file' });
                }
            };
            reader.onerror = () => reject({ success: false, message: 'Gagal membaca file' });
            reader.readAsText(file);
        });
    }
}

// Global instance
const wishlistManager = new WishlistManager();

// Update navbar wishlist badge
function updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    const count = wishlistManager.getWishlistCount();
    
    if (badge) {
        if (count > 0) {
            badge.style.display = 'flex';
            badge.textContent = count;
        } else {
            badge.style.display = 'none';
        }
    }
}

/**
 * Toggle wishlist for item
 */
function toggleWishlist(item, element = null) {
    const itemId = item.id || item;
    
    if (wishlistManager.isInWishlist(itemId)) {
        wishlistManager.removeFromWishlist(itemId);
        if (element) {
            element.classList.remove('active');
            element.style.color = '';
        }
        showNotification('success', 'Dihapus dari wishlist');
    } else {
        const result = wishlistManager.addToWishlist(
            typeof item === 'object' ? item : { id: itemId, name: 'Item' }
        );
        if (result.success) {
            if (element) {
                element.classList.add('active');
                element.style.color = '#ff4444';
            }
            showNotification('success', 'Ditambahkan ke wishlist');
        }
    }
    updateWishlistBadge();
}

/**
 * Add to wishlist with full item data
 */
function addToWishlist(item) {
    const result = wishlistManager.addToWishlist(item);
    if (result.success) {
        showNotification('success', result.message);
        updateWishlistBadge();
    } else {
        showNotification('info', result.message);
    }
}

/**
 * Remove from wishlist
 */
function removeFromWishlist(itemId) {
    wishlistManager.removeFromWishlist(itemId);
    updateWishlistBadge();
    showNotification('success', 'Dihapus dari wishlist');
}

/**
 * Get wishlist for display
 */
function getWishlist() {
    return wishlistManager.getWishlist();
}

/**
 * Notification helper
 */
function showNotification(type, message) {
    if (window.NotificationManager) {
        window.NotificationManager.show(type, message);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

// Subscribe to wishlist changes
wishlistManager.subscribe(() => {
    updateWishlistBadge();
});

// Update on page load
document.addEventListener('DOMContentLoaded', updateWishlistBadge);
