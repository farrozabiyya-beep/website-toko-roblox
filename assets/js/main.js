// ============ MAIN JAVASCRIPT ============

// ========== PREVENT HORIZONTAL SCROLL & SWIPE ==========
document.addEventListener('touchmove', (e) => {
    // Allow vertical scroll
    if (e.touches.length === 1) {
        // Single touch - allow vertical only
        const touch = e.touches[0];
        // Prevent swipe if it's mostly horizontal
        if (Math.abs(touch.clientX - (window.lastX || touch.clientX)) > 
            Math.abs(touch.clientY - (window.lastY || touch.clientY))) {
            // More horizontal than vertical - try to prevent
        }
        window.lastX = touch.clientX;
        window.lastY = touch.clientY;
    }
}, { passive: true });

// Prevent two-finger swipe/zoom
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
}, false);

// Navigation & Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Toggle hamburger menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Generate particles dengan animasi yang lebih baik
function generateParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth > 768 ? 80 : 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = Math.random() * 5 + 8 + 's';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        
        particlesContainer.appendChild(particle);
    }
}

// Generate falling stars untuk community section
function generateFallingStars() {
    const container = document.getElementById('communityParticles');
    if (!container) return;

    const starCount = window.innerWidth > 768 ? 15 : 8;
    
    // Create initial stars
    for (let i = 0; i < starCount; i++) {
        createFallingStar(container);
    }
    
    // Continue creating new stars periodically
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance to create new star
            createFallingStar(container);
        }
    }, 500);
}

function createFallingStar(container) {
    const star = document.createElement('i');
    star.classList.add('fas', 'fa-star', 'falling-star');
    
    // Random position
    const xPos = Math.random() * 100;
    const duration = Math.random() * 3 + 3; // 3-6 seconds
    const delay = Math.random() * 2; // 0-2 seconds delay
    const randomTranslate = Math.random() * 100 - 50; // -50 to 50 px horizontal movement
    
    star.style.left = xPos + '%';
    star.style.top = '-50px';
    star.style.setProperty('--translateX', randomTranslate + 'px');
    star.style.animationDuration = duration + 's';
    star.style.animationDelay = delay + 's';
    
    container.appendChild(star);
    
    // Remove star after animation completes
    setTimeout(() => {
        star.remove();
    }, (duration + delay) * 1000);
}

// Navigate to page
function goToPage(url) {
    window.location.href = url;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateParticles();
    generateFallingStars();
    // Load user data from localStorage if exists
    loadUserData();
});

// User data management
function saveUserData(username, phone, email = '') {
    const userData = {
        username: username,
        phone: phone,
        email: email,
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('userData', JSON.stringify(userData));
}

function loadUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
}

function clearUserData() {
    localStorage.removeItem('userData');
    localStorage.removeItem('cartData');
    localStorage.removeItem('orderData');
}

// Cart management
function addToCart(productId, productName, price, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cartData')) || [];
    
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cartData', JSON.stringify(cart));
    showNotification('Produk ditambahkan ke keranjang!', 'success');
}

function getCart() {
    return JSON.parse(localStorage.getItem('cartData')) || [];
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cartData')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cartData', JSON.stringify(cart));
}

function clearCart() {
    localStorage.removeItem('cartData');
}

// Order management
function createOrder(username, phone, products, paymentMethod, gamepassLink = '') {
    const orderId = generateOrderId();
    const totalPrice = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    const order = {
        id: orderId,
        username: username,
        phone: phone,
        products: products,
        paymentMethod: paymentMethod,
        gamepassLink: gamepassLink,
        totalPrice: totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return order;
}

function getOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.find(o => o.id === orderId);
}

function getOrdersByUsername(username) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(o => o.username === username);
}

function getOrdersByPhone(phone) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(o => o.phone === phone);
}

function updateOrderStatus(orderId, status) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// Generate unique order ID
function generateOrderId() {
    return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#00bfff'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
    `;
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Validate username (Roblox API)
async function validateUsername(username) {
    if (!username || username.length < 3) {
        return false;
    }
    
    try {
        // Try Roblox API endpoint
        const response = await fetch(`https://api.roblox.com/users/get-by-username?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.id) {
                // Simpan user ID untuk digunakan di avatar fetch
                window.lastValidatedUserId = data.id;
                return true;
            }
        }
    } catch (error) {
        console.log('API validation failed, using fallback');
    }
    
    // Fallback: Basic validation
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

// Get Roblox user avatar dengan User ID
async function getUserAvatar(username) {
    try {
        let userId = window.lastValidatedUserId;
        
        // Jika tidak ada cached user ID, fetch terlebih dahulu
        if (!userId) {
            const response = await fetch(`https://api.roblox.com/users/get-by-username?username=${encodeURIComponent(username)}`);
            if (response.ok) {
                const data = await response.json();
                userId = data.id;
            }
        }
        
        // Gunakan endpoint avatar dengan user ID
        if (userId) {
            return `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
        }
    } catch (error) {
        console.log('Error fetching avatar:', error);
    }
    
    // Fallback avatar
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"%3E%3Ccircle cx="75" cy="75" r="75" fill="%23cccccc"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="60" fill="%23666"%3E?%3C/text%3E%3C/svg%3E';
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

// Format phone number
function formatPhoneNumber(phone) {
    phone = phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
        phone = '62' + phone.substring(1);
    } else if (!phone.startsWith('62')) {
        phone = '62' + phone;
    }
    return phone;
}

// Validate phone number
function validatePhoneNumber(phone) {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Open WhatsApp chat
function openWhatsApp(phoneNumber, message = '') {
    const phone = formatPhoneNumber(phoneNumber);
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

// Smooth scroll
function smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Check if user is admin
function isAdmin() {
    const adminToken = localStorage.getItem('adminToken');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!adminToken || !loginTime) return false;
    
    // Session timeout: 24 jam
    const now = new Date();
    const loginDate = new Date(loginTime);
    const diffHours = (now - loginDate) / (1000 * 60 * 60);
    
    if (diffHours > 24) {
        adminLogout();
        return false;
    }
    
    return true;
}

// Admin login
function adminLogin(username, password) {
    // Keamanan: Ganti password di production
    const ADMIN_USERNAME = 'devstore';
    const ADMIN_PASSWORD = 'devstore1230';
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', username);
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        return true;
    }
    return false;
}

// Admin logout
function adminLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'admin/login.html';
}

// Generate QR Code (placeholder)
function generateQRCode(text, elementId) {
    // In real implementation, use qrcode.js library
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<p>QR Code untuk: ${text}</p>`;
    }
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
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

// ============ ANIMATED BACKGROUNDS ============

// Product Page - Floating Clouds
function setupProductClouds() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const cloudLeft = document.createElement('div');
    cloudLeft.classList.add('product-cloud', 'left');
    cloudLeft.textContent = '☁️';
    
    const cloudRight = document.createElement('div');
    cloudRight.classList.add('product-cloud', 'right');
    cloudRight.textContent = '☁️';
    
    hero.appendChild(cloudLeft);
    hero.appendChild(cloudRight);

    // Hide clouds on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            cloudLeft.classList.add('scroll-hide');
            cloudRight.classList.add('scroll-hide');
        } else {
            cloudLeft.classList.remove('scroll-hide');
            cloudRight.classList.remove('scroll-hide');
        }
    });
}

// About Section - Lightning/Rain Animation
function setupLightningAnimation() {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;

    const flash = document.createElement('div');
    flash.classList.add('lightning-flash');
    aboutSection.appendChild(flash);

    // Generate rain drops
    for (let i = 0; i < 30; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = -10 + 'px';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (0.5 + Math.random() * 1) + 's';
        aboutSection.appendChild(drop);
    }
}

// Payment Section - Money Scatter Animation - REMOVED

// Follow Section - REMOVED (camera flash animation removed per requirement)

// Header/Footer - Clouds REMOVED (per requirement)
function setupHeaderFooterClouds() {
    // Clouds removed from header/footer - only clouds in hero section now
}

// Initialize all animated backgrounds
function initAnimatedBackgrounds() {
    setupProductClouds();
    setupLightningAnimation();
    setupReviewParticles();
}

// Review Page - Sparkle particles animation
function setupReviewParticles() {
    const reviewPage = document.querySelector('.review-page');
    if (!reviewPage) return;

    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle-particle');
        sparkle.textContent = '✨';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
        sparkle.style.opacity = Math.random() * 0.7 + 0.3;
        sparkle.style.animation = `sparkleFloat ${Math.random() * 2 + 1.5}s ease-out forwards`;
        reviewPage.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 3000);
    }, 200);
}

// Contact Page - Animations REMOVED per requirement

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimatedBackgrounds);
} else {
    initAnimatedBackgrounds();
}

// Prevent console errors in offline mode
console.log('%c DEV ROBLOX SHOP v1.0', 'color: #00bfff; font-size: 16px; font-weight: bold;');

