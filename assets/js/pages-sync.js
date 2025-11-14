// ========== PAGES SYNC SYSTEM ==========
// Memastikan semua halaman memiliki akses ke flash sale dan website status

class PagesSyncManager {
    constructor() {
        this.pollInterval = 3000;
    }

    init() {
        console.log('📄 Pages Sync initialized');

        // Check website status immediately
        this.checkWebsiteStatus();

        // Setup polling
        setInterval(() => {
            this.checkWebsiteStatus();
            this.checkFlashSale();
        }, this.pollInterval);

        // Setup localStorage listener
        window.addEventListener('storage', (e) => {
            if (e.key === 'websiteStatus' || e.key === 'flashSales' || e.key === '_adminDataUpdate') {
                this.checkWebsiteStatus();
                this.checkFlashSale();
            }
        });
    }

    checkWebsiteStatus() {
        try {
            const status = JSON.parse(localStorage.getItem('websiteStatus') || '{"isOpen": true}');

            if (!status.isOpen) {
                // Tampilkan modal website closed
                this.showWebsiteClosed();
            } else {
                // Tutup modal jika ada
                const modal = document.getElementById('websiteClosedModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        } catch (error) {
            console.warn('⚠ Error checking website status:', error);
        }
    }

    checkFlashSale() {
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

            banner.style.display = isActive ? 'block' : 'none';
        } catch (error) {
            console.warn('⚠ Error checking flash sale:', error);
        }
    }

    showWebsiteClosed() {
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

            // Add styles jika belum ada
            if (!document.getElementById('websiteClosedStyles')) {
                const style = document.createElement('style');
                style.id = 'websiteClosedStyles';
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
            }

            document.body.appendChild(modal);
        }

        modal.style.display = 'flex';
    }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const pageSync = new PagesSyncManager();
    pageSync.init();
    console.log('%c ✓ Pages sync module loaded', 'color: #28a745; font-size: 12px;');
});
