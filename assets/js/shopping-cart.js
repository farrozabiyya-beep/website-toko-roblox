/**
 * Shopping Cart System
 * Mengelola keranjang belanja pelanggan
 */

class ShoppingCart {
    constructor() {
        this.storageKey = 'shoppingCart';
        this.items = this.loadCart();
        this.listeners = [];
    }

    loadCart() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch {
            return [];
        }
    }

    saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        this.notifyListeners();
    }

    addItem(item) {
        // Check if item already exists
        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image || null,
                addedAt: Date.now(),
                productType: item.productType || 'product'
            });
        }
        
        this.saveCart();
        return true;
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        return true;
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
            return true;
        }
        return false;
    }

    getItems() {
        return this.items;
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    isEmpty() {
        return this.items.length === 0;
    }

    clear() {
        this.items = [];
        this.saveCart();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.items));
    }

    applyDiscount(percentage) {
        const discount = this.getTotal() * (percentage / 100);
        return {
            subtotal: this.getTotal(),
            discount: discount,
            total: this.getTotal() - discount,
            percentage: percentage
        };
    }

    getCart() {
        return {
            items: this.items,
            itemCount: this.getItemCount(),
            subtotal: this.getTotal(),
            total: this.getTotal()
        };
    }
}

// Global instance
const shoppingCart = new ShoppingCart();

// Update navbar cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const count = shoppingCart.getItemCount();
    
    if (badge) {
        if (count > 0) {
            badge.style.display = 'flex';
            badge.textContent = count;
        } else {
            badge.style.display = 'none';
        }
    }
}

// Add item to cart with notification
function addToCart(item) {
    shoppingCart.addItem(item);
    updateCartBadge();
    
    if (window.NotificationManager) {
        window.NotificationManager.show('success', `${item.name} ditambahkan ke keranjang!`);
    }
}

// Subscribe to cart changes
shoppingCart.subscribe(() => {
    updateCartBadge();
});

// Update on page load
document.addEventListener('DOMContentLoaded', updateCartBadge);
