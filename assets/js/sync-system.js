// ========== REAL-TIME SYNC SYSTEM ==========
// File untuk sinkronisasi data real-time antara customer website dan admin panel
// Menggunakan Netlify Functions + localStorage polling + Web Worker simulation

/**
 * SYNC MANAGER - Mengelola sinkronisasi data real-time
 * - Polling ke Netlify Functions setiap 5 detik
 * - localStorage event listener untuk same-device sync
 * - Auto-update order display di customer page
 * - Notifikasi untuk admin panel
 */

class SyncManager {
    constructor() {
        this.isCustomerPage = !window.location.pathname.includes('/admin');
        this.isAdminPage = window.location.pathname.includes('/admin');
        this.pollInterval = 5000; // 5 seconds
        this.lastOrderCount = 0;
        this.lastSyncTime = 0;
        this.syncEnabled = true;
        this.ordersCache = [];
        
        console.log('📡 SyncManager initialized');
        console.log('   Type:', this.isAdminPage ? 'ADMIN' : 'CUSTOMER');
    }

    /**
     * Mulai real-time sync
     * Polling ke Netlify Functions dan listen localStorage changes
     */
    start() {
        if (!this.syncEnabled) {
            console.warn('⚠ Sync is disabled');
            return;
        }

        console.log('▶ Starting sync system...');

        // Setup polling untuk fetch data dari Netlify
        this.startPolling();

        // Setup localStorage event listener untuk same-device sync
        this.setupStorageListener();

        // Setup visibility change handler (pause sync ketika tab tidak visible)
        this.setupVisibilityListener();

        console.log('✓ Sync system started successfully');
    }

    /**
     * Polling ke Netlify Functions untuk fetch latest orders
     */
    startPolling() {
        // Initial fetch
        this.syncData();

        // Setup interval
        this.pollTimer = setInterval(() => {
            if (document.hidden) {
                console.log('  (Tab not visible, skipping sync)');
                return;
            }
            this.syncData();
        }, this.pollInterval);

        console.log(`✓ Polling started (interval: ${this.pollInterval}ms)`);
    }

    /**
     * Fetch data dari Netlify Functions
     */
    async syncData() {
        try {
            const response = await fetch('/.netlify/functions/saveOrder', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const orders = await response.json();
            
            // Check if ada order baru
            const newOrderCount = orders.length;
            if (newOrderCount !== this.lastOrderCount) {
                console.log(`📊 Order count changed: ${this.lastOrderCount} → ${newOrderCount}`);
                
                // Trigger update event
                this.triggerUpdate('orders-changed', {
                    orders: orders,
                    count: newOrderCount,
                    timestamp: new Date().getTime()
                });

                // Update cache
                this.ordersCache = orders;
                this.lastOrderCount = newOrderCount;
            }

            this.lastSyncTime = new Date().getTime();
            
        } catch (error) {
            console.warn('⚠ Sync error:', error.message);
            // Fallback ke localStorage
            this.syncFromLocalStorage();
        }
    }

    /**
     * Fallback: Sinkronisasi dari localStorage
     */
    syncFromLocalStorage() {
        try {
            const ordersJSON = localStorage.getItem('orders');
            if (!ordersJSON) return;

            const orders = JSON.parse(ordersJSON);
            const newOrderCount = orders.length;

            if (newOrderCount !== this.lastOrderCount) {
                console.log(`📊 [localStorage] Order count changed: ${this.lastOrderCount} → ${newOrderCount}`);
                this.triggerUpdate('orders-changed', {
                    orders: orders,
                    count: newOrderCount,
                    source: 'localStorage',
                    timestamp: new Date().getTime()
                });
                this.lastOrderCount = newOrderCount;
            }
        } catch (error) {
            console.warn('⚠ localStorage sync error:', error);
        }
    }

    /**
     * Listen untuk localStorage changes dari tab/window lain
     */
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'orders') {
                console.log('💾 Storage event detected (from another tab/window)');
                
                try {
                    const newOrders = JSON.parse(event.newValue || '[]');
                    const oldOrders = event.oldValue ? JSON.parse(event.oldValue) : [];

                    // Check jika ada order baru
                    if (newOrders.length > oldOrders.length) {
                        const newOrderAdded = newOrders[newOrders.length - 1];
                        console.log('✓ New order detected:', newOrderAdded.id);

                        this.triggerUpdate('new-order', {
                            order: newOrderAdded,
                            allOrders: newOrders,
                            timestamp: new Date().getTime()
                        });

                        this.lastOrderCount = newOrders.length;
                    }
                } catch (error) {
                    console.warn('⚠ Error parsing storage event:', error);
                }
            }

            // Listen untuk custom sync signals
            if (event.key === '_syncSignal') {
                console.log('🔄 Sync signal received');
                this.syncData();
            }
        });

        console.log('✓ Storage listener setup complete');
    }

    /**
     * Pause sync ketika tab tidak visible, resume ketika visible
     */
    setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('👁️ Tab hidden, pausing sync');
                clearInterval(this.pollTimer);
            } else {
                console.log('👁️ Tab visible, resuming sync');
                this.startPolling();
            }
        });

        console.log('✓ Visibility listener setup complete');
    }

    /**
     * Trigger custom event untuk update
     */
    triggerUpdate(eventName, detail) {
        const event = new CustomEvent(`sync:${eventName}`, {
            detail: detail,
            bubbles: true
        });

        console.log(`🎯 Triggering event: ${eventName}`, detail);
        window.dispatchEvent(event);
    }

    /**
     * Broadcast ke localStorage untuk trigger same-device sync
     */
    broadcastUpdate() {
        localStorage.setItem('_syncSignal', new Date().getTime().toString());
    }

    /**
     * Stop sync system
     */
    stop() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
        }
        this.syncEnabled = false;
        console.log('⏹ Sync system stopped');
    }

    /**
     * Get last sync time
     */
    getLastSyncTime() {
        return this.lastSyncTime;
    }

    /**
     * Force sync immediately
     */
    async forceSyncNow() {
        console.log('🔄 Force sync initiated');
        await this.syncData();
        console.log('✓ Force sync complete');
    }
}

// ========== INITIALIZE SYNC ==========
let syncManager = null;

document.addEventListener('DOMContentLoaded', () => {
    syncManager = new SyncManager();
    syncManager.start();
    
    console.log('%c 📡 SYNC SYSTEM ACTIVE', 'color: #00bfff; font-size: 14px; font-weight: bold;');
});

// Export untuk digunakan di file lain
window.syncManager = syncManager;

// ========== HELPER FUNCTIONS ==========

/**
 * Force refresh data di admin panel
 */
function forceAdminRefresh() {
    if (window.syncManager) {
        window.syncManager.forceSyncNow();
    }
}

/**
 * Get current orders from cache
 */
function getCachedOrders() {
    return window.syncManager ? window.syncManager.ordersCache : [];
}

/**
 * Listen untuk order updates
 * Usage: onOrderUpdate((data) => console.log('New orders:', data.orders));
 */
function onOrderUpdate(callback) {
    window.addEventListener('sync:orders-changed', (event) => {
        callback(event.detail);
    });
}

/**
 * Listen untuk new order
 * Usage: onNewOrder((data) => console.log('Order:', data.order));
 */
function onNewOrder(callback) {
    window.addEventListener('sync:new-order', (event) => {
        callback(event.detail);
    });
}

/**
 * Notify customer bahwa order mereka sudah diterima
 */
function notifyOrderReceived(orderId) {
    localStorage.setItem('_orderNotification_' + orderId, JSON.stringify({
        orderId: orderId,
        message: 'Order Anda telah diterima',
        timestamp: new Date().toISOString()
    }));
    
    // Broadcast
    localStorage.setItem('_syncSignal', new Date().getTime().toString());
}

/**
 * Notify customer bahwa order mereka sedang diproses
 */
function notifyOrderProcessing(orderId) {
    localStorage.setItem('_orderNotification_' + orderId, JSON.stringify({
        orderId: orderId,
        status: 'processing',
        message: 'Order Anda sedang diproses',
        timestamp: new Date().toISOString()
    }));
    
    localStorage.setItem('_syncSignal', new Date().getTime().toString());
}

/**
 * Notify customer bahwa order mereka selesai
 */
function notifyOrderComplete(orderId) {
    localStorage.setItem('_orderNotification_' + orderId, JSON.stringify({
        orderId: orderId,
        status: 'completed',
        message: 'Order Anda telah selesai!',
        timestamp: new Date().toISOString()
    }));
    
    localStorage.setItem('_syncSignal', new Date().getTime().toString());
}

// Expose notification functions
window.notifyOrderReceived = notifyOrderReceived;
window.notifyOrderProcessing = notifyOrderProcessing;
window.notifyOrderComplete = notifyOrderComplete;

console.log('%c ✓ Sync system module loaded', 'color: #28a745; font-size: 12px;');
