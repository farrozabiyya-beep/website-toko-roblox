// ========== WEBSITE REAL-TIME SYNC SYSTEM ==========
// Menangani sinkronisasi real-time untuk:
// 1. Stok Produk
// 2. Website Status (Buka/Tutup)
// 3. Flash Sale

class WebsiteSyncManager {
    constructor() {
        this.pollInterval = 3000; // 3 detik
        this.lastStockUpdate = 0;
        this.lastStatusUpdate = 0;
        this.lastFlashSaleUpdate = 0;
        this.syncEnabled = true;

        console.log('📡 WebsiteSyncManager initialized');
    }

    start() {
        if (!this.syncEnabled) {
            console.warn('⚠ Website sync is disabled');
            return;
        }

        console.log('▶ Starting website sync system...');

        // Initial load
        this.updateWebsiteStatus();
        this.updateFlashSale();
        this.updateStockInfo();

        // Setup polling
        this.startPolling();

        // Setup storage listener untuk same-device sync
        this.setupStorageListener();

        console.log('✓ Website sync system started successfully');
    }

    startPolling() {
        this.pollTimer = setInterval(() => {
            if (document.hidden) {
                return;
            }
            this.updateWebsiteStatus();
            this.updateFlashSale();
            this.updateStockInfo();
        }, this.pollInterval);

        console.log(`✓ Website polling started (interval: ${this.pollInterval}ms)`);
    }

    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'websiteStatus' || event.key === '_adminDataUpdate') {
                this.updateWebsiteStatus();
            }
            if (event.key === 'flashSales' || event.key === '_adminDataUpdate') {
                this.updateFlashSale();
            }
            if (event.key === 'productStocks' || event.key === '_adminDataUpdate') {
                this.updateStockInfo();
            }
        });

        console.log('✓ Storage listener setup complete');
    }

    // ========== WEBSITE STATUS ==========
    updateWebsiteStatus() {
        try {
            const status = JSON.parse(localStorage.getItem('websiteStatus') || '{"isOpen": true}');

            if (!status.isOpen) {
                // Website ditutup - tampilkan modal
                this.showWebsiteClosedModal();
            } else {
                // Website buka - tutup modal jika ada
                this.hideWebsiteClosedModal();
            }

            this.lastStatusUpdate = new Date().getTime();
        } catch (error) {
            console.warn('⚠ Error updating website status:', error);
        }
    }

    showWebsiteClosedModal() {
        let modal = document.getElementById('websiteClosedModal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'websiteClosedModal';
            modal.className = 'website-closed-modal';
            modal.innerHTML = `
                <div class="website-closed-content">
                    <div class="closed-icon">
                        <i class="fas fa-lock-alt"></i>
                    </div>
                    <h2>Toko Sedang Tutup</h2>
                    <p>Maaf, toko sedang ditutup sementara oleh admin. Silakan coba lagi nanti.</p>
                    <p class="closed-note">Terima kasih atas kesabaran Anda!</p>
                </div>
            `;

            const style = document.createElement('style');
            style.textContent = `
                #websiteClosedModal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }

                .website-closed-content {
                    background: white;
                    padding: 40px 30px;
                    border-radius: 15px;
                    text-align: center;
                    max-width: 400px;
                    animation: scaleIn 0.3s ease;
                }

                .closed-icon {
                    font-size: 60px;
                    color: #dc3545;
                    margin-bottom: 20px;
                }

                .website-closed-content h2 {
                    color: #333;
                    margin-bottom: 15px;
                    font-size: 24px;
                }

                .website-closed-content p {
                    color: #666;
                    margin-bottom: 10px;
                    line-height: 1.6;
                }

                .closed-note {
                    color: #999;
                    font-size: 14px;
                    font-style: italic;
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @media (max-width: 768px) {
                    .website-closed-content {
                        max-width: 90%;
                        padding: 30px 20px;
                    }

                    .closed-icon {
                        font-size: 50px;
                    }

                    .website-closed-content h2 {
                        font-size: 20px;
                    }
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(modal);
        }

        modal.style.display = 'flex';
    }

    hideWebsiteClosedModal() {
        const modal = document.getElementById('websiteClosedModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // ========== FLASH SALE ==========
    updateFlashSale() {
        try {
            const flashSales = JSON.parse(localStorage.getItem('flashSales') || '[]');
            const now = new Date().getTime();
            const banner = document.getElementById('flashSaleBanner');

            if (!banner) return;

            let isActive = false;

            flashSales.forEach(sale => {
                const mulai = new Date(sale.waktuMulai).getTime();
                const berakhir = new Date(sale.waktuBerakhir).getTime();

                if (now >= mulai && now <= berakhir) {
                    isActive = true;
                }
            });

            if (isActive) {
                banner.style.display = 'block';
                console.log('✓ Flash sale is active, showing banner');
            } else {
                banner.style.display = 'none';
                console.log('✓ No active flash sale');
            }

            this.lastFlashSaleUpdate = new Date().getTime();
        } catch (error) {
            console.warn('⚠ Error updating flash sale:', error);
        }
    }

    // ========== STOK PRODUK ==========
    updateStockInfo() {
        try {
            const stocks = JSON.parse(localStorage.getItem('productStocks') || '{}');

            // Update product cards dengan badge stok jika ada yang 0
            document.querySelectorAll('.product-card').forEach(card => {
                // Cek stok dari localStorage
                // Implementasi custom jika diperlukan untuk setiap produk
            });

            this.lastStockUpdate = new Date().getTime();
        } catch (error) {
            console.warn('⚠ Error updating stock info:', error);
        }
    }

    stop() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
        }
        this.syncEnabled = false;
        console.log('⏹ Website sync system stopped');
    }

    forceSyncNow() {
        console.log('🔄 Force website sync initiated');
        this.updateWebsiteStatus();
        this.updateFlashSale();
        this.updateStockInfo();
        console.log('✓ Force website sync complete');
    }
}

// ========== INITIALIZE ==========
let websiteSyncManager = null;

document.addEventListener('DOMContentLoaded', () => {
    websiteSyncManager = new WebsiteSyncManager();
    websiteSyncManager.start();

    console.log('%c 📡 WEBSITE SYNC SYSTEM ACTIVE', 'color: #ff6b6b; font-size: 14px; font-weight: bold;');
});

// Export untuk digunakan di file lain
window.websiteSyncManager = websiteSyncManager;

// ========== HELPER FUNCTIONS ==========

/**
 * Force refresh website sync
 */
function forceWebsiteSync() {
    if (window.websiteSyncManager) {
        window.websiteSyncManager.forceSyncNow();
    }
}

console.log('%c ✓ Website sync module loaded', 'color: #28a745; font-size: 12px;');
