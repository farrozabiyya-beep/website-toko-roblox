// ========== WEBSITE FEATURES MANAGEMENT ==========
// Menangani Flash Sale, Website Status, dan Stok Produk

class WebsiteFeatures {
    constructor() {
        this.websiteStatus = this.getWebsiteStatus();
        this.flashSales = this.getFlashSales();
        this.productStocks = this.getProductStocks();
    }

    getWebsiteStatus() {
        return JSON.parse(localStorage.getItem('websiteStatus') || '{"isOpen": true}');
    }

    getFlashSales() {
        return JSON.parse(localStorage.getItem('flashSales') || '[]');
    }

    getProductStocks() {
        return JSON.parse(localStorage.getItem('productStocks') || '{}');
    }

    init() {
        this.checkWebsiteStatus();
        this.initFlashSaleDisplay();
        this.initStockDisplay();
        this.listenForUpdates();
    }

    // ========== CHECK WEBSITE STATUS ==========
    checkWebsiteStatus() {
        if (!this.websiteStatus.isOpen) {
            this.showWebsiteClosedPopup();
        }
    }

    showWebsiteClosedPopup() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'websiteClosedOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        // Create popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: popupIn 0.4s ease-out;
        `;

        popup.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 20px;">🔴</div>
            <h2 style="color: #333; margin-bottom: 15px;">Maaf, Toko Sedang Tutup</h2>
            <p style="color: #666; margin-bottom: 30px; font-size: 1.1rem;">Silakan kembali nanti untuk berbelanja.</p>
            <button id="closePopupBtn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 0.3s ease;
            ">Kembali ke Beranda</button>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes popupIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        // Button click handler
        document.getElementById('closePopupBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Disable all page interactions
        document.body.style.overflow = 'hidden';
    }

    // ========== FLASH SALE DISPLAY ==========
    initFlashSaleDisplay() {
        const now = new Date().getTime();
        
        this.flashSales.forEach(sale => {
            const mulai = new Date(sale.waktuMulai).getTime();
            const berakhir = new Date(sale.waktuBerakhir).getTime();
            
            // Cek apakah flash sale aktif
            if (now >= mulai && now <= berakhir) {
                this.displayFlashSaleBadge(sale);
                this.displayFlashSaleCountdown(sale);
            }
        });

        // Update countdown setiap detik
        setInterval(() => {
            this.updateCountdowns();
        }, 1000);
    }

    displayFlashSaleBadge(sale) {
        const productElement = document.querySelector(`[data-product="${sale.produk}"]`);
        if (!productElement) return;

        const badge = document.createElement('div');
        badge.className = 'flash-sale-badge';
        badge.innerHTML = `
            <span style="font-size: 1.2rem;">🔥</span>
            <span>Flash Sale</span>
        `;

        // Insert badge di product card
        const productCard = productElement.closest('.product-card') || productElement.closest('.product');
        if (productCard) {
            // Remove if badge exists
            const existingBadge = productCard.querySelector('.flash-sale-badge');
            if (existingBadge) existingBadge.remove();
            
            productCard.style.position = 'relative';
            productCard.insertBefore(badge, productCard.firstChild);
        }
    }

    displayFlashSaleCountdown(sale) {
        const productElement = document.querySelector(`[data-product="${sale.produk}"]`);
        if (!productElement) return;

        const countdown = document.createElement('div');
        countdown.className = 'flash-sale-countdown';
        countdown.setAttribute('data-end', sale.waktuBerakhir);
        countdown.setAttribute('data-product', sale.produk);

        const productCard = productElement.closest('.product-card') || productElement.closest('.product');
        if (productCard) {
            // Remove if countdown exists
            const existingCountdown = productCard.querySelector('.flash-sale-countdown');
            if (existingCountdown) existingCountdown.remove();
            
            productCard.appendChild(countdown);
        }

        this.updateCountdown(countdown);
    }

    updateCountdown(countdownElement) {
        const endTime = new Date(countdownElement.getAttribute('data-end')).getTime();
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance <= 0) {
            countdownElement.innerHTML = 'Flash Sale Berakhir';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let countdownText = '';
        if (days > 0) {
            countdownText = `${days}h ${hours}m`;
        } else if (hours > 0) {
            countdownText = `${hours}h ${minutes}m`;
        } else {
            countdownText = `${minutes}m ${seconds}s`;
        }

        countdownElement.innerHTML = `⏱️ ${countdownText}`;
    }

    updateCountdowns() {
        const countdownElements = document.querySelectorAll('.flash-sale-countdown');
        countdownElements.forEach(element => {
            this.updateCountdown(element);
        });
    }

    // ========== STOCK DISPLAY & DISABLE ==========
    initStockDisplay() {
        // Disable products with no stock
        const productKeys = Object.keys(this.productStocks);
        
        productKeys.forEach(productId => {
            const stok = this.productStocks[productId];
            const productElement = document.querySelector(`[data-product="${productId}"]`);
            
            if (productElement && stok <= 0) {
                this.disableProduct(productElement);
            }
        });
    }

    disableProduct(productElement) {
        const productCard = productElement.closest('.product-card') || productElement.closest('.product');
        if (!productCard) return;

        // Add disabled class
        productCard.classList.add('product-out-of-stock');

        // Add overlay with label
        const overlay = document.createElement('div');
        overlay.className = 'stock-overlay';
        overlay.innerHTML = `
            <div class="stock-label">
                <i class="fas fa-ban"></i>
                <span>Stok Habis</span>
            </div>
        `;

        productCard.style.position = 'relative';
        productCard.appendChild(overlay);

        // Disable all buttons
        const buttons = productCard.querySelectorAll('a, button');
        buttons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.5';
        });
    }

    // ========== LISTEN FOR UPDATES ==========
    listenForUpdates() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'websiteStatus' || e.key === '_adminDataUpdate') {
                this.websiteStatus = this.getWebsiteStatus();
                // Reload page if status changed
                location.reload();
            }
            if (e.key === 'flashSales' || e.key === '_adminDataUpdate') {
                this.flashSales = this.getFlashSales();
                this.initFlashSaleDisplay();
            }
            if (e.key === 'productStocks' || e.key === '_adminDataUpdate') {
                this.productStocks = this.getProductStocks();
                this.initStockDisplay();
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const features = new WebsiteFeatures();
    features.init();
    window.websiteFeatures = features;
});
