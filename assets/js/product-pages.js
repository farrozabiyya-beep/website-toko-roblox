// ============ PRODUCT PAGES FUNCTIONALITY ============

// ============ SUCCESS POPUP FUNCTION ============
function showSuccessPopup(orderId) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-in;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 40px 30px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease-out;
    `;

    modal.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 20px;">
            <i class="fas fa-check-circle" style="color: #28a745;"></i>
        </div>
        <h2 style="color: #0047ab; margin-bottom: 15px; font-size: 1.8rem;">
            Terima Kasih! 😇
        </h2>
        <p style="color: #555; font-size: 1.1rem; margin-bottom: 10px; line-height: 1.6;">
            Terima kasih telah mengisi data pembelian kamu
        </p>
        <p style="color: #555; font-size: 1rem; margin-bottom: 10px; line-height: 1.6;">
            Silahkan cek di <strong>PesananKu</strong>, dan kamu akan dialihkan ke halaman utama ya
        </p>
        
        <div style="
            background: linear-gradient(135deg, #0047ab 0%, #00bfff 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
        ">
            <p style="font-size: 0.85rem; margin: 0 0 8px 0; opacity: 0.9;">📋 ID Pesanan Anda:</p>
            <p style="font-size: 1.3rem; margin: 0; font-weight: bold; font-family: monospace;">${orderId}</p>
            <p style="font-size: 0.8rem; margin: 8px 0 0 0; opacity: 0.8;">Simpan untuk referensi</p>
        </div>
        
        <p style="color: #888; font-size: 0.9rem; margin-bottom: 30px;">
            Terima kasih 🙏
        </p>
        <button id="closeSuccessPopup" style="
            background: #00bfff;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        " onmouseover="this.style.background='#0047ab'" onmouseout="this.style.background='#00bfff'">
            Tutup & Ke Halaman Utama
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Close button handler
    document.getElementById('closeSuccessPopup').addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            overlay.remove();
            window.location.href = '../index.html'; // Redirect to home
        }, 300);
    });

    // Auto close after 10 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
                window.location.href = '../index.html';
            }, 300);
        }
    }, 10000);
}

const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = checkoutModal ? checkoutModal.querySelector('.close') : null;

// Debug: Log if modal is found
console.log('Checkout Modal Found:', !!checkoutModal);
console.log('Close Button Found:', !!closeCheckoutBtn);

// Check Username
const checkUsernameBtn = document.getElementById('checkUsernameBtn');
if (checkUsernameBtn) {
    checkUsernameBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        
        if (!username) {
            showNotification('Masukkan username terlebih dahulu', 'error');
            return;
        }

        checkUsernameBtn.disabled = true;
        checkUsernameBtn.classList.add('loading');

        try {
            const isValid = await validateUsername(username);
            const statusElement = document.getElementById('usernameStatus');
            const avatarContainer = document.getElementById('avatarContainer');
            
            if (isValid) {
                statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Username ditemukan!';
                statusElement.className = 'username-status valid';
                
                // Get avatar
                const avatarUrl = await getUserAvatar(username);
                document.getElementById('avatarImage').src = avatarUrl;
                document.getElementById('usernameDisplay').textContent = username;
                avatarContainer.style.display = 'block';
            } else {
                statusElement.innerHTML = '<i class="fas fa-times-circle"></i> Username tidak ditemukan';
                statusElement.className = 'username-status invalid';
                avatarContainer.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Terjadi kesalahan saat mengecek username', 'error');
        } finally {
            checkUsernameBtn.disabled = false;
            checkUsernameBtn.classList.remove('loading');
        }
    });
}

// Form Submission
const gamepassForm = document.getElementById('gamepassForm');
if (gamepassForm) {
    gamepassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });
}

function handleFormSubmit() {
    console.log('handleFormSubmit called');
    
    const username = document.getElementById('username').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const robuxSelect = document.querySelector('input[name="robux"]:checked');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const gamepassLink = document.getElementById('gamepassLink') ? document.getElementById('gamepassLink').value.trim() : '';

    // Validation
    if (!username) {
        showNotification('Masukkan username terlebih dahulu', 'error');
        return;
    }

    if (!robuxSelect) {
        showNotification('Pilih jumlah Robux', 'error');
        return;
    }

    if (!paymentMethod) {
        showNotification('Pilih metode pembayaran', 'error');
        return;
    }

    // Parse selected robux
    const [robuxAmount, price] = robuxSelect.value.split('-');

    // Generate Order ID first
    const orderId = 'ORD' + Date.now();

    // Create message untuk WhatsApp dengan Order ID
    const message = `Halo min, saya ingin membeli:

Username: ${username}
Item: ${robuxAmount} Robux
Harga: Rp ${parseInt(price).toLocaleString('id-ID')}
Metode Pembayaran: ${getPaymentMethodName(paymentMethod.value)}
${gamepassLink ? 'Link Gamepass: ' + gamepassLink : ''}

*📋 ID Pesanan: ${orderId}*

Mohon segera diproses. Terima kasih!`;

    // Buka WhatsApp ke nomor admin: 6281214477714
    const adminPhone = '6281214477714';
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${adminPhone}?text=${encoded}`, '_blank');

    // Create order dengan ID yang sudah dibuat
    const createdOrder = {
        id: orderId,
        username: username,
        item: robuxAmount + ' Robux',
        price: parseInt(price),
        paymentMethod: paymentMethod.value,
        status: 'pending',
        date: new Date().toLocaleDateString('id-ID')
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(createdOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Sync dengan admin panel
    localStorage.setItem('_customerDataUpdate', new Date().getTime().toString());

    // Show success popup dengan Order ID
    showSuccessPopup(orderId);
    
    // Reset form
    document.getElementById('gamepassForm').reset();
}

function showCheckoutModal(username, robuxAmount, price, paymentMethod, gamepassLink) {
    // Update summary
    document.getElementById('summaryUsername').textContent = username;
    document.getElementById('summaryRobux').textContent = robuxAmount + ' Robux';
    document.getElementById('summaryPrice').textContent = formatCurrency(parseInt(price));
    document.getElementById('summaryPayment').textContent = getPaymentMethodName(paymentMethod);
    document.getElementById('summaryTotal').textContent = formatCurrency(parseInt(price));

    // Show payment details
    const paymentDetailsDiv = document.getElementById('paymentDetails');
    paymentDetailsDiv.innerHTML = getPaymentDetails(paymentMethod);

    checkoutModal.style.display = 'block';

    // Store data for later use
    window.currentOrder = {
        username: username,
        robuxAmount: robuxAmount,
        price: parseInt(price),
        paymentMethod: paymentMethod,
        gamepassLink: gamepassLink,
        whatsapp: document.getElementById('whatsapp').value.trim(),
        promoCode: document.getElementById('promoCode').value.trim()
    };
}

function getPaymentMethodName(method) {
    const names = {
        gopay: 'GoPay',
        dana: 'DANA',
        ovo: 'OVO',
        shopeepay: 'ShopeePay',
        qris: 'QRIS'
    };
    return names[method] || method;
}

function getPaymentDetails(method) {
    const methodNames = {
        gopay: 'GoPay',
        dana: 'DANA',
        ovo: 'OVO',
        shopeepay: 'ShopeePay',
        qris: 'QRIS'
    };

    return `
        <div class="payment-details-content">
            <div class="payment-method-display">
                <img src="../assets/images/logo.jpg" alt="${methodNames[method]}" class="payment-method-icon">
                <h4>${methodNames[method]}</h4>
            </div>
            
            <div class="qris-section">
                <p style="text-align: center; margin: 15px 0; color: var(--dark-gray); font-size: 0.95rem;">
                    Silakan scan dan transfer ke QRIS berikut:
                </p>
                <div class="qr-code-display" style="text-align: center; margin: 20px 0;">
                    <img src="../assets/images/qris.png" alt="QRIS Code" style="max-width: 250px; height: auto; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                </div>
            </div>
        </div>
    `;
}

function proceedToPayment() {
    if (!window.currentOrder) return;

    const order = window.currentOrder;
    const message = `Min aku sudah transfer dengan nominal ${formatCurrency(order.price)} dan ini data akun ku ya min

Username: ${order.username}
Link Gamepass: ${order.gamepassLink}
Nominal robux via gamepass yang dipesan: ${order.robuxAmount} Robux
Kode Promo: ${order.promoCode || 'Tidak ada'}

Terima kasih min ditunggu responnya`;

    // Create order in local storage
    const createdOrder = createOrder(
        order.username,
        order.whatsapp,
        [{
            id: 'robux-' + order.robuxAmount,
            name: order.robuxAmount + ' Robux',
            price: order.price,
            quantity: 1
        }],
        order.paymentMethod,
        order.gamepassLink
    );

    // Open WhatsApp
    openWhatsApp(order.whatsapp, message);

    // Close modal and show success message
    setTimeout(() => {
        checkoutModal.style.display = 'none';
        showNotification('Pesanan dibuat! Silahkan kirim bukti transfer ke WhatsApp', 'success');
        
        // Redirect to order page after 2 seconds
        setTimeout(() => {
            window.location.href = 'order.html';
        }, 2000);
    }, 1000);
}

// Reset Form
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        gamepassForm.reset();
        document.getElementById('usernameStatus').textContent = '';
        document.getElementById('avatarContainer').style.display = 'none';
        showNotification('Form telah direset', 'info');
    });
}

// Close Checkout Modal
if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });
}

// Close Modal Button
const closeModalBtn = document.getElementById('closeModalBtn');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        if (checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
}

window.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
});

// Gamepass Link Preview
const gamepassLinkInput = document.getElementById('gamepassLink');
if (gamepassLinkInput) {
    gamepassLinkInput.addEventListener('change', (e) => {
        const link = e.target.value.trim();
        if (link) {
            const previewDiv = document.getElementById('gamepassPreview');
            previewDiv.style.display = 'block';
            // In real implementation, fetch gamepass details from Roblox API
            document.getElementById('gamepassReview').innerHTML = `
                <p><strong>Link Gamepass:</strong> ${link}</p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                    <i class="fas fa-info-circle"></i> Preview gamepass akan ditampilkan setelah pembayaran dikonfirmasi
                </p>
            `;
        }
    });
}

// ============ OTHER PRODUCT PAGES ============

// Robux Instant Page
function setupRobuxInstantPage() {
    const form = document.getElementById('robuxInstantForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const robuxSelect = document.querySelector('input[name="robux"]:checked');
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

        if (!username || !password || !whatsapp || !robuxSelect || !paymentMethod) {
            showNotification('Lengkapi semua field yang diperlukan', 'error');
            return;
        }

        if (!validatePhoneNumber(whatsapp)) {
            showNotification('Format nomor WhatsApp tidak valid', 'error');
            return;
        }

        const [robuxAmount, price] = robuxSelect.value.split('-');
        showCheckoutModalInstant(username, robuxAmount, price, paymentMethod.value);
    });
}

// Premium Upgrade Page
function setupPremiumUpgradePage() {
    const form = document.getElementById('premiumForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!username || !password || !whatsapp) {
            showNotification('Lengkapi semua field yang diperlukan', 'error');
            return;
        }

        if (!validatePhoneNumber(whatsapp)) {
            showNotification('Format nomor WhatsApp tidak valid', 'error');
            return;
        }

        showCheckoutModalPremium(username, whatsapp, email);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupRobuxInstantPage();
    setupPremiumUpgradePage();
});

// ============ GAME PRODUCT PAGES ============

function setupGameProductPage(gameName, products) {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const productSelect = document.querySelector('input[name="product"]:checked');
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

        if (!username || !whatsapp || !productSelect || !paymentMethod) {
            showNotification('Lengkapi semua field yang diperlukan', 'error');
            return;
        }

        if (!validatePhoneNumber(whatsapp)) {
            showNotification('Format nomor WhatsApp tidak valid', 'error');
            return;
        }

        const [productName, price] = productSelect.value.split('-');
        const order = window.currentOrder = {
            game: gameName,
            productName: productName,
            price: parseInt(price),
            paymentMethod: paymentMethod.value,
            username: username,
            whatsapp: whatsapp
        };

        showGameProductCheckout(gameName, productName, price, paymentMethod.value);
    });
}

function showGameProductCheckout(gameName, productName, price, paymentMethod) {
    const order = window.currentOrder;
    
    // Update and show checkout modal
    document.getElementById('summaryUsername').textContent = order.username;
    document.getElementById('summaryRobux').textContent = gameName + ' - ' + productName;
    document.getElementById('summaryPrice').textContent = formatCurrency(parseInt(price));
    document.getElementById('summaryPayment').textContent = getPaymentMethodName(paymentMethod);
    document.getElementById('summaryTotal').textContent = formatCurrency(parseInt(price));
    document.getElementById('paymentDetails').innerHTML = getPaymentDetails(paymentMethod);
    
    checkoutModal.style.display = 'block';
}

// Export functions for other pages
window.setupGameProductPage = setupGameProductPage;

// ============ PRODUCT PAGE BACKGROUND ANIMATIONS ============
// Product page animations removed per requirement

// ============ ADMIN-SHOP REAL-TIME SYNC ============

/**
 * Listen untuk stock updates dari admin dashboard
 * Update product display secara real-time
 */
function setupStockSyncListener() {
    // Listen untuk custom event dari admin
    window.addEventListener('adminStockUpdated', (event) => {
        const stocks = event.detail.stocks;
        updateProductDisplayFromStock(stocks);
    });

    // Listen untuk storage events (cross-tab communication)
    window.addEventListener('storage', (event) => {
        if (event.key === '__stockUpdateSignal') {
            const data = JSON.parse(event.newValue || '{}');
            const stocks = data.stocks || [];
            updateProductDisplayFromStock(stocks);
        }
    });

    // Periodic polling untuk memastikan sync
    setInterval(() => {
        const stocks = JSON.parse(localStorage.getItem('stocks')) || [];
        if (stocks.length > 0) {
            updateProductDisplayFromStock(stocks);
        }
    }, 3000);
}

/**
 * Update product display items berdasarkan stock dari admin
 * Cocokkan product items dengan stock data
 */
function updateProductDisplayFromStock(stocks) {
    const productItems = document.querySelectorAll('.robux-item');
    
    productItems.forEach(item => {
        const productName = item.querySelector('.robux-amount').textContent.trim();
        const priceText = item.querySelector('.robux-price').textContent.trim();
        const price = parseInt(priceText.replace(/\D/g, ''));
        
        // Cari stock yang match dengan product
        const matchingStock = stocks.find(s => {
            const stockNameMatch = s.name.toLowerCase().includes(productName.toLowerCase());
            const stockPriceMatch = s.price === price;
            return stockNameMatch || stockPriceMatch;
        });

        // Update UI berdasarkan stock availability
        const radioInput = item.querySelector('input[type="radio"]');
        if (matchingStock) {
            if (matchingStock.quantity <= 0) {
                // Stock habis - disable radio
                radioInput.disabled = true;
                item.style.opacity = '0.6';
                item.style.pointerEvents = 'none';
                item.title = 'Produk sedang habis';
            } else {
                // Stock tersedia - enable radio
                radioInput.disabled = false;
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
                item.title = `Stok tersedia: ${matchingStock.quantity}`;
            }
        }
    });
}

/**
 * Initialize stock sync listener saat page load
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupStockSyncListener);
} else {
    setupStockSyncListener();
}


window.proceedToPayment = proceedToPayment;
window.getPaymentDetails = getPaymentDetails;
