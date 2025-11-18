/**
 * Flash Sale System untuk E-Commerce Produk Digital
 * Real-time countdown dan label management
 */

class FlashSaleSystem {
    constructor() {
        this.flashSales = this.loadFlashSales();
        this.updateInterval = null;
        this.init();
    }

    /**
     * Load mock flash sale data
     */
    loadFlashSales() {
        return JSON.parse(localStorage.getItem('flashSales') || '[]');
    }

    /**
     * Save flash sale data
     */
    saveFlashSales() {
        localStorage.setItem('flashSales', JSON.stringify(this.flashSales));
    }

    /**
     * Add flash sale
     */
    addFlashSale(productId, startTime, endTime, label = 'Flash Sale ⚡') {
        const flashSale = {
            id: Date.now(),
            productId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            label
        };
        this.flashSales.push(flashSale);
        this.saveFlashSales();
        this.updateAllProducts();
        return flashSale;
    }

    /**
     * Remove flash sale
     */
    removeFlashSale(flashSaleId) {
        this.flashSales = this.flashSales.filter(fs => fs.id !== flashSaleId);
        this.saveFlashSales();
        this.updateAllProducts();
    }

    /**
     * Get flash sale for product
     */
    getFlashSaleForProduct(productId) {
        return this.flashSales.find(fs => {
            const now = new Date();
            return fs.productId == productId && 
                   now >= fs.startTime && 
                   now <= fs.endTime;
        });
    }

    /**
     * Check if flash sale is active
     */
    isFlashSaleActive(flashSaleId) {
        const fs = this.flashSales.find(f => f.id === flashSaleId);
        if (!fs) return false;
        const now = new Date();
        return now >= fs.startTime && now <= fs.endTime;
    }

    /**
     * Get time remaining
     */
    getTimeRemaining(flashSaleId) {
        const fs = this.flashSales.find(f => f.id === flashSaleId);
        if (!fs) return null;

        const now = new Date();
        const remaining = fs.endTime - now;

        if (remaining <= 0) return null;

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        return {
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
            formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        };
    }

    /**
     * Initialize and update
     */
    init() {
        this.updateAllProducts();
        this.updateInterval = setInterval(() => this.updateAllProducts(), 1000);
    }

    /**
     * Update all products
     */
    updateAllProducts() {
        document.querySelectorAll('[data-product-id]').forEach(product => {
            this.updateProduct(product);
        });
    }

    /**
     * Update single product
     */
    updateProduct(productElement) {
        const productId = productElement.dataset.productId;
        const flashSale = this.getFlashSaleForProduct(productId);
        const labelElement = productElement.querySelector('.flash-sale-label');
        const countdownElement = productElement.querySelector('.flash-sale-countdown');

        if (flashSale && this.isFlashSaleActive(flashSale.id)) {
            // Show label and countdown
            if (labelElement) labelElement.style.display = 'flex';
            if (countdownElement) {
                countdownElement.style.display = 'block';
                const time = this.getTimeRemaining(flashSale.id);
                if (time) {
                    countdownElement.textContent = `⏱️ ${time.formatted}`;
                }
            }
        } else {
            // Hide label and countdown
            if (labelElement) labelElement.style.display = 'none';
            if (countdownElement) countdownElement.style.display = 'none';
        }
    }

    /**
     * Get all active flash sales
     */
    getActiveFlashSales() {
        const now = new Date();
        return this.flashSales.filter(fs => 
            now >= fs.startTime && now <= fs.endTime
        );
    }

    /**
     * Get all flash sales
     */
    getAllFlashSales() {
        return this.flashSales;
    }

    /**
     * Destroy
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Global instance
const flashSaleSystem = new FlashSaleSystem();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    flashSaleSystem.init();
});
