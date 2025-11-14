// Script untuk mengganti semua logo gear dengan SVG logo baru
// Jalankan di Node.js atau browser console

const logoSVG = `<svg class="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00bfff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0047ab;stop-opacity:1" />
        </linearGradient>
    </defs>
    <!-- Circle Background -->
    <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.2"/>
    <!-- Inner Circle -->
    <circle cx="50" cy="50" r="38" fill="none" stroke="url(#logoGradient)" stroke-width="2"/>
    <!-- Letter D -->
    <text x="50" y="60" font-family="Arial, sans-serif" font-size="45" font-weight="bold" text-anchor="middle" fill="white">D</text>
</svg>`;

const logoTemplate = `<div class="logo">
    <a href="index.html" title="Kembali ke Beranda">
        ${logoSVG}
        <span class="logo-text">DEV ROBLOX SHOP</span>
    </a>
</div>`;

const logoTemplateRelative = `<div class="logo">
    <a href="../index.html" title="Kembali ke Beranda">
        ${logoSVG}
        <span class="logo-text">DEV ROBLOX SHOP</span>
    </a>
</div>`;

const logoTemplateAdmin = `<div class="logo">
    <a href="../../index.html" title="Kembali ke Beranda">
        ${logoSVG}
        <span class="logo-text">DEV ROBLOX SHOP</span>
    </a>
</div>`;

console.log('Logo SVG berhasil dibuat!');
console.log('Template untuk index.html:');
console.log(logoTemplate);
console.log('\nTemplate untuk pages/*.html:');
console.log(logoTemplateRelative);
console.log('\nTemplate untuk pages/admin/*.html:');
console.log(logoTemplateAdmin);
