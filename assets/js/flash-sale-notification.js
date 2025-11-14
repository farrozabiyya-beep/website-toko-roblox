// ========== FLASH SALE POPUP NOTIFICATION ==========
// Menampilkan popup kecil pada halaman utama ketika ada flash sale aktif

class FlashSaleNotification {
    constructor() {
        this.pollInterval = 3000;
        this.isShowing = false;
    }

    init() {
        // Check flash sale saat loading
        this.checkAndShowFlashSalePopup();

        // Setup polling untuk check flash sale
        setInterval(() => {
            this.checkAndShowFlashSalePopup();
        }, this.pollInterval);

        // Listen untuk storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'flashSales' || e.key === '_adminDataUpdate') {
                this.checkAndShowFlashSalePopup();
            }
        });

        console.log('✓ Flash Sale Notification initialized');
    }

    checkAndShowFlashSalePopup() {
        try {
            const flashSales = JSON.parse(localStorage.getItem('flashSales') || '[]');
            const now = new Date().getTime();

            let activeFlashSale = null;

            // Cari flash sale yang sedang aktif
            flashSales.forEach(sale => {
                const mulai = new Date(sale.waktuMulai).getTime();
                const berakhir = new Date(sale.waktuBerakhir).getTime();

                if (now >= mulai && now <= berakhir) {
                    activeFlashSale = sale;
                }
            });

            if (activeFlashSale && !this.isShowing) {
                // Ada flash sale aktif dan popup belum tampil
                this.showFlashSalePopup(activeFlashSale);
                this.isShowing = true;
            } else if (!activeFlashSale && this.isShowing) {
                // Tidak ada flash sale aktif dan popup sedang tampil
                this.hideFlashSalePopup();
                this.isShowing = false;
            }
        } catch (error) {
            console.warn('⚠ Error checking flash sale:', error);
        }
    }

    showFlashSalePopup(flashSale) {
        let popup = document.getElementById('flashSalePopup');

        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'flashSalePopup';
            popup.className = 'flash-sale-popup';
            document.body.appendChild(popup);

            // Add styles jika belum ada
            if (!document.getElementById('flashSalePopupStyles')) {
                const style = document.createElement('style');
                style.id = 'flashSalePopupStyles';
                style.textContent = `
                    .flash-sale-popup {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #ff6b6b 0%, #ff8e72 100%);
                        color: white;
                        padding: 20px 25px;
                        border-radius: 12px;
                        box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
                        z-index: 2000;
                        max-width: 320px;
                        animation: slideInBottomRight 0.5s ease-out;
                    }

                    .flash-sale-popup-header {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 12px;
                        font-weight: bold;
                        font-size: 1.1rem;
                    }

                    .flash-sale-popup-header i {
                        font-size: 1.3rem;
                        animation: pulse 1s ease-in-out infinite;
                    }

                    .flash-sale-popup-product {
                        background: rgba(255, 255, 255, 0.15);
                        padding: 10px;
                        border-radius: 8px;
                        margin-bottom: 10px;
                        font-size: 0.9rem;
                    }

                    .flash-sale-popup-product strong {
                        display: block;
                        margin-bottom: 5px;
                    }

                    .flash-sale-popup-price {
                        display: flex;
                        gap: 10px;
                        font-size: 0.85rem;
                    }

                    .flash-sale-popup-price .old-price {
                        text-decoration: line-through;
                        opacity: 0.8;
                    }

                    .flash-sale-popup-price .new-price {
                        font-weight: bold;
                        color: #ffeb3b;
                    }

                    .flash-sale-popup-button {
                        display: block;
                        width: 100%;
                        background: rgba(255, 255, 255, 0.25);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-top: 10px;
                        transition: all 0.3s ease;
                    }

                    .flash-sale-popup-button:hover {
                        background: rgba(255, 255, 255, 0.4);
                        transform: scale(1.05);
                    }

                    .flash-sale-popup-close {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.2rem;
                        cursor: pointer;
                        opacity: 0.8;
                        transition: opacity 0.3s ease;
                    }

                    .flash-sale-popup-close:hover {
                        opacity: 1;
                    }

                    @keyframes slideInBottomRight {
                        from {
                            transform: translate(400px, 400px);
                            opacity: 0;
                        }
                        to {
                            transform: translate(0, 0);
                            opacity: 1;
                        }
                    }

                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.1);
                        }
                    }

                    @media (max-width: 768px) {
                        .flash-sale-popup {
                            bottom: 15px;
                            right: 15px;
                            left: 15px;
                            max-width: none;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // Hitung diskon
        const discount = Math.round(((parseFloat(flashSale.hargaNormal) - parseFloat(flashSale.harga)) / parseFloat(flashSale.hargaNormal)) * 100);

        popup.innerHTML = `
            <button class="flash-sale-popup-close" onclick="document.getElementById('flashSalePopup').style.opacity='0';setTimeout(() => document.getElementById('flashSalePopup').style.display='none', 300);">&times;</button>
            <div class="flash-sale-popup-header">
                <i class="fas fa-fire"></i>
                <span>FLASH SALE!</span>
            </div>
            <div class="flash-sale-popup-product">
                <strong>${flashSale.produk}</strong>
                <div class="flash-sale-popup-price">
                    <span class="old-price">Rp ${parseInt(flashSale.hargaNormal).toLocaleString('id-ID')}</span>
                    <span class="new-price">Rp ${parseInt(flashSale.harga).toLocaleString('id-ID')}</span>
                </div>
                <div style="margin-top: 5px; font-weight: bold;">Hemat ${discount}%!</div>
            </div>
            <button class="flash-sale-popup-button" onclick="window.location.href='pages/product.html'">
                Lihat Sekarang
            </button>
        `;

        popup.style.display = 'block';
        popup.style.opacity = '1';
    }

    hideFlashSalePopup() {
        const popup = document.getElementById('flashSalePopup');
        if (popup) {
            popup.style.transition = 'opacity 0.3s ease';
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }
    }
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    // Cek apakah kita di halaman utama (index.html)
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const flashSaleNotif = new FlashSaleNotification();
        flashSaleNotif.init();
        console.log('%c ✓ Flash Sale Notification loaded', 'color: #28a745; font-size: 12px;');
    }
});
