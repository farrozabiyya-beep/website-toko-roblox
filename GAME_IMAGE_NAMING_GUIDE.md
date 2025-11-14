# 🎮 PANDUAN NAMING GAME IMAGES

Dokumentasi lengkap untuk naming convention gambar produk game saat menambahkan game baru di website.

---

## 📝 FORMAT NAMA FILE GAMBAR GAME

### Standard Format:
```
[game-name-slug].png
```

### Contoh Existing:
- `car-driving.png` → Car Driving Indonesia
- `taxi-boss.png` → Taxi Boss
- `steal-brainrot.png` → Steal a Brainrot
- `strongest-battlegrounds.png` → Strongest Battlegrounds
- `brookhaven.png` → Brookhaven RP
- `salon-fiestas.png` → Salon de Fiestas
- `blox-fruit.png` → Blox Fruit
- `fisch.png` → Fisch
- `grow-garden.png` → Grow Garden

---

## ✨ RULES NAMING CONVENTION

### 1️⃣ **Gunakan Lowercase**
```
✅ BENAR:  robux-instant.png
❌ SALAH:  Robux-Instant.png
❌ SALAH:  ROBUX_INSTANT.png
```

### 2️⃣ **Gunakan Separator Dash (-)**
```
✅ BENAR:  strongest-battlegrounds.png
❌ SALAH:  strongest_battlegrounds.png
❌ SALAH:  strongestbattlegrounds.png
```

### 3️⃣ **Gunakan Format .png (Recommended)**
```
✅ BENAR:  car-driving.png
❌ SALAH:  car-driving.jpg (bisa, tapi png lebih konsisten)
```

### 4️⃣ **Singkat & Deskriptif**
```
✅ BENAR:  blox-fruit.png (singkat, jelas)
❌ SALAH:  blox-fruit-gamepass-image-card.png (terlalu panjang)
```

### 5️⃣ **Hindari Karakter Khusus**
```
✅ BENAR:  salon-fiestas.png
❌ SALAH:  salon-fiësta's.png
❌ SALAH:  salon@fiestas.png
```

---

## 🎯 NAMING EXAMPLES UNTUK GAME BARU

### Contoh 1: Adopt Me
```
Nama Game: Adopt Me!
Nama File: adopt-me.png
```

### Contoh 2: Piggy
```
Nama Game: PIGGY
Nama File: piggy.png
```

### Contoh 3: Speed Run 4
```
Nama Game: Speed Run 4
Nama File: speed-run-4.png
```

### Contoh 4: Murder Mystery 2
```
Nama Game: Murder Mystery 2
Nama File: murder-mystery-2.png
```

### Contoh 5: Theme Park Tycoon 2
```
Nama Game: Theme Park Tycoon 2
Nama File: theme-park-tycoon-2.png
```

### Contoh 6: Jailbreak
```
Nama Game: Jailbreak
Nama File: jailbreak.png
```

### Contoh 7: Welcome to Bloxburg
```
Nama Game: Welcome to Bloxburg
Nama File: welcome-to-bloxburg.png
```

---

## 📏 SPESIFIKASI FILE GAMBAR

### Ukuran Rekomendasi:
```
Width:  400 px
Height: 250 px
Ratio:  16:9 (landscape)
```

### Format File:
```
Format: PNG (preferred) atau JPEG
Quality: High (tidak blur/pixelated)
File Size: 80-150 KB per gambar
Color Space: RGB
DPI: 72 dpi
```

### Konten Gambar:
```
✅ Screenshot game official
✅ Cover art dari developer game
✅ Game thumbnail dari Roblox
✅ Custom design dengan logo game

❌ Watermark berlebihan
❌ Kualitas rendah/blur
❌ Screenshot yang berantakan
```

---

## 🗂️ FOLDER STRUCTURE

```
assets/images/
├── logo.jpg
├── qris.png
├── robux-gamepass.png
├── premium.png
├── robux-instant.png
├── akun-roblox.png
├── car-driving.png              ← Game 1
├── taxi-boss.png                ← Game 2
├── steal-brainrot.png           ← Game 3
├── strongest-battlegrounds.png  ← Game 4
├── brookhaven.png               ← Game 5
├── salon-fiestas.png            ← Game 6
├── blox-fruit.png               ← Game 7
├── fisch.png                    ← Game 8
├── grow-garden.png              ← Game 9
├── adopt-me.png                 ← Game 10 (Baru)
├── piggy.png                    ← Game 11 (Baru)
├── speed-run-4.png              ← Game 12 (Baru)
└── ...dst
```

---

## 🔗 CARA MENAMBAHKAN GAME BARU

### Step 1: Siapkan Gambar
```
1. Ambil screenshot atau cover art game
2. Resize ke 400x250 px
3. Pastikan quality tinggi (tidak blur)
4. Export sebagai PNG
```

### Step 2: Naming
```
Nama Game: "Welcome to Bloxburg"
Nama File: welcome-to-bloxburg.png
         ↓
Format: [adjective-adjective-noun-number].png
        [lowercase-with-dashes].png
```

### Step 3: Letakkan di Folder
```
assets/images/welcome-to-bloxburg.png
```

### Step 4: Update HTML
```html
<!-- Di halaman product grid atau pages -->
<div class="game-card">
    <img src="assets/images/welcome-to-bloxburg.png" 
         alt="Welcome to Bloxburg"
         data-game-id="12">
</div>
```

### Step 5: Update JavaScript (Jika diperlukan)
```javascript
// Di assets/js/product-pages.js
const gameList = [
    // ... game lain
    {
        id: 12,
        name: 'Welcome to Bloxburg',
        image: 'welcome-to-bloxburg.png',
        description: 'Simulasi kehidupan dengan membangun rumah dan berkarir'
    }
];
```

---

## 📋 CHECKLIST SEBELUM UPLOAD GAME BARU

- [ ] Game image sudah siap (400x250 px)
- [ ] Nama file lowercase dengan dash separator
- [ ] Format PNG atau JPEG
- [ ] File size < 150 KB
- [ ] Kualitas gambar bagus (tidak blur)
- [ ] Nama file sesuai game title
- [ ] Letakkan di folder `assets/images/`
- [ ] Update HTML dengan image path baru
- [ ] Update JavaScript jika ada product list
- [ ] Test di browser (gambar muncul?)
- [ ] Check console (ada error 404?)
- [ ] Test responsive (mobile view OK?)

---

## 🔍 NAMING CONVENTION QUICK REFERENCE

| Game Name | Image Filename |
|-----------|---|
| Adopt Me! | `adopt-me.png` |
| Piggy | `piggy.png` |
| Speed Run 4 | `speed-run-4.png` |
| Murder Mystery 2 | `murder-mystery-2.png` |
| Theme Park Tycoon 2 | `theme-park-tycoon-2.png` |
| Jailbreak | `jailbreak.png` |
| Welcome to Bloxburg | `welcome-to-bloxburg.png` |
| Royale High | `royale-high.png` |
| Dress to Impress | `dress-to-impress.png` |
| Arsenal | `arsenal.png` |
| Zombie Rush Tycoon | `zombie-rush-tycoon.png` |
| Build a Boat for Treasure | `build-a-boat-for-treasure.png` |
| Lumber Tycoon 2 | `lumber-tycoon-2.png` |
| Restaurant Tycoon 2 | `restaurant-tycoon-2.png` |
| Brookhaven RP | `brookhaven-rp.png` |

---

## 🎨 DESIGN TIPS

### Untuk Screenshot:
```
1. Setting graphics ke High/Ultra
2. Ambil area utama game (hindari UI menus)
3. Pastikan karakter/objek utama terlihat jelas
4. Brightness normal (tidak terlalu gelap/terang)
```

### Untuk Custom Design:
```
1. Gunakan warna yang vibrant
2. Tambahkan game title di image (opsional)
3. Gunakan font yang readable
4. Tambahkan shadow/outline untuk readability
5. Konsisten dengan brand color (biru #0047ab)
```

---

## 📞 SUPPORT

### Jika gambar tidak muncul:
1. Cek console browser (F12 → Console)
2. Cari error message "404" atau "image not found"
3. Pastikan nama file dan path sudah benar
4. Hard refresh browser (Ctrl + Shift + R)

### Jika ragu tentang naming:
- Gunakan format yang sudah ada sebagai reference
- Singkat, deskriptif, lowercase, dash separator
- Tanya admin jika tidak yakin

---

## 📌 RINGKASAN

**Format Nama File Game Image:**
```
[game-name-in-kebab-case].png
```

**Contoh:**
```
✅ adopt-me.png
✅ royale-high.png
✅ speed-run-4.png
✅ theme-park-tycoon-2.png
```

**Ukuran:**
```
400 x 250 px
80-150 KB
PNG atau JPEG
```

**Lokasi:**
```
assets/images/[filename].png
```

---

**Dibuat untuk Dev Roblox Shop**
**Update: 14 November 2025**
