// ============ PAGE LOADER - NAVIGATION ANIMATION ============
// Muncul hanya saat navigasi antar halaman (bukan saat page load pertama)

class PageLoader {
    constructor() {
        this.loader = null;
        this.isVisible = false;
        this.isFirstVisit = !sessionStorage.getItem('pageLoaded');
    }

    init() {
        this.createLoaderHTML();
        this.addLoaderStyles();
        this.attachNavigationListeners();
    }

    createLoaderHTML() {
        const loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.innerHTML = `
            <div class="loader-overlay">
                <div class="loader-content">
                    <h2 class="loader-title">
                        Memuat Halaman
                        <span class="dots">
                            <span class="dot">.</span>
                            <span class="dot">.</span>
                            <span class="dot">.</span>
                        </span>
                    </h2>

                    <!-- Animated circles -->
                    <div class="loader-animation">
                        <div class="circle circle-1"></div>
                        <div class="circle circle-2"></div>
                        <div class="circle circle-3"></div>
                        <div class="center-glow"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
        this.loader = loader;
    }

    addLoaderStyles() {
        if (document.getElementById('pageLoaderStyles')) return;

        const style = document.createElement('style');
        style.id = 'pageLoaderStyles';
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

            #pageLoader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 8888;
                pointer-events: none;
                display: none;
            }

            #pageLoader.visible {
                display: block;
                pointer-events: auto;
            }

            .loader-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 82, 0.95) 100%);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeInLoader 0.4s ease-out;
            }

            @keyframes fadeInLoader {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .loader-content {
                text-align: center;
            }

            .loader-title {
                font-family: 'Poppins', sans-serif;
                font-size: 1.8rem;
                font-weight: 600;
                color: #ffffff;
                margin: 0 0 50px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                letter-spacing: 1px;
                background: linear-gradient(135deg, #00bfff 0%, #0047ab 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: titleGlow 2s ease-in-out infinite;
            }

            @keyframes titleGlow {
                0%, 100% {
                    filter: drop-shadow(0 0 10px rgba(0, 191, 255, 0.3));
                    text-shadow: 0 0 20px rgba(0, 191, 255, 0.2);
                }
                50% {
                    filter: drop-shadow(0 0 25px rgba(0, 191, 255, 0.8));
                    text-shadow: 0 0 40px rgba(0, 191, 255, 0.4);
                }
            }

            .dots {
                display: inline-flex;
                gap: 6px;
            }

            .dot {
                color: #00bfff;
                font-weight: 700;
                animation: dotPulse 1.4s ease-in-out infinite;
            }

            .dot:nth-child(1) {
                animation-delay: 0s;
            }

            .dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes dotPulse {
                0%, 60%, 100% {
                    opacity: 0.4;
                }
                30% {
                    opacity: 1;
                }
            }

            /* Loader Animation */
            .loader-animation {
                position: relative;
                width: 150px;
                height: 150px;
                margin: 0 auto;
            }

            .circle {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 3px solid;
                border-radius: 50%;
                animation: orbitRotate linear infinite;
            }

            .circle-1 {
                width: 120px;
                height: 120px;
                border-color: rgba(0, 191, 255, 0.3);
                animation-duration: 8s;
                animation-direction: clockwise;
            }

            .circle-2 {
                width: 80px;
                height: 80px;
                border-color: rgba(0, 191, 255, 0.5);
                animation-duration: 6s;
                animation-direction: reverse;
            }

            .circle-3 {
                width: 40px;
                height: 40px;
                border-color: #00bfff;
                animation-duration: 4s;
            }

            @keyframes orbitRotate {
                from {
                    transform: translate(-50%, -50%) rotate(0deg);
                }
                to {
                    transform: translate(-50%, -50%) rotate(360deg);
                }
            }

            .center-glow {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 30px;
                background: radial-gradient(circle at 30% 30%, #00ffff, #0047ab);
                border-radius: 50%;
                box-shadow: 0 0 30px rgba(0, 191, 255, 0.8),
                            0 0 60px rgba(0, 47, 167, 0.4),
                            inset 0 0 15px rgba(0, 191, 255, 0.5);
                animation: glowPulse 2s ease-in-out infinite;
            }

            @keyframes glowPulse {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(0, 191, 255, 0.6),
                                0 0 40px rgba(0, 47, 167, 0.3),
                                inset 0 0 10px rgba(0, 191, 255, 0.3);
                }
                50% {
                    box-shadow: 0 0 40px rgba(0, 191, 255, 1),
                                0 0 80px rgba(0, 47, 167, 0.6),
                                inset 0 0 20px rgba(0, 191, 255, 0.6);
                }
            }

            /* Fade out animation */
            #pageLoader.fade-out {
                animation: fadeOutLoader 0.4s ease-in forwards;
            }

            @keyframes fadeOutLoader {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            @media (max-width: 768px) {
                .loader-title {
                    font-size: 1.4rem;
                }

                .loader-animation {
                    width: 120px;
                    height: 120px;
                }

                .circle-1 {
                    width: 100px;
                    height: 100px;
                }

                .circle-2 {
                    width: 60px;
                    height: 60px;
                }

                .circle-3 {
                    width: 30px;
                    height: 30px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    show(duration = 6000) {
        if (!this.loader) return;
        this.loader.classList.remove('fade-out');
        this.loader.classList.add('visible');
        this.isVisible = true;

        // Auto hide after specified duration (default 6 seconds)
        setTimeout(() => {
            this.hide();
        }, duration);
    }

    hide() {
        if (!this.loader || !this.isVisible) return;
        this.loader.classList.add('fade-out');
        setTimeout(() => {
            this.loader.classList.remove('visible');
            this.isVisible = false;
        }, 400);
    }

    attachNavigationListeners() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            // Skip jika link external atau hash
            if (link.target === '_blank' || link.href.includes('#')) {
                return;
            }

            // Skip admin, whatsapp, instagram
            if (link.href.includes('/admin') || 
                link.href.includes('wa.me') || 
                link.href.includes('instagram')) {
                return;
            }

            // Skip jika javascript
            if (link.href.includes('javascript')) {
                return;
            }

            // Check if internal navigation
            const currentDomain = window.location.origin;
            if (link.href.startsWith(currentDomain) || link.href.startsWith('/')) {
                this.show(2000); // 2 detik untuk navigasi per halaman
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const loader = new PageLoader();
    loader.init();
    window.pageLoader = loader;
    
    // Show loading hanya pada first visit (3 detik)
    if (loader.isFirstVisit) {
        loader.show(3000); // 3 detik untuk first visit
        sessionStorage.setItem('pageLoaded', 'true'); // Mark sebagai sudah diload
    }
});
