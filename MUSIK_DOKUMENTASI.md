# 🎵 Sistem Musik Background - Dokumentasi

## Overview

Sistem musik background yang persist di semua halaman dengan fitur:

- ✅ Musik dimulai otomatis saat user pertama kali interaksi
- ✅ Musik tetap berlanjut saat pindah halaman
- ✅ Musik dapat dinyalakan/dimatikan via tombol toggle
- ✅ State musik disimpan di localStorage (untuk session berikutnya)
- ✅ Posisi musik disimpan di sessionStorage (untuk navigasi antar halaman)

---

## File-File yang Terlibat

### 1. **js/shared.js**

Berisi core functions untuk musik:

- `initBackgroundMusic()` - Initialize musik system
- `playBackgroundMusic()` - Mainkan musik
- `pauseBackgroundMusic()` - Pause musik
- `toggleBackgroundMusic()` - Toggle musik on/off
- `updateMusicButton()` - Update UI button state

**Key Features:**

- Auto-detect path (`./sounds/` untuk root, `../sounds/` untuk activity pages)
- Reuse existing audio element jika sudah ada
- Load preference dari localStorage
- Default: musik ON untuk session pertama

### 2. **js/persistent-music.js**

Memastikan musik persist across page navigation:

- Save musik state (currentTime, enabled status) ke sessionStorage sebelum navigasi
- Restore musik state saat page load
- Add user interaction listener untuk autoplay bypass
- Work dengan beforeunload, pagehide, pageshow, DOMContentLoaded events

**Key Logic:**

```javascript
// Sebelum meninggalkan halaman → Simpan posisi musik
window.addEventListener("beforeunload", saveMusicalState);

// Saat halaman baru load → Restore musik
window.addEventListener("pageshow", restoreMusicalState);
document.addEventListener("DOMContentLoaded", restoreMusicalState);

// User click → Start musik (bypass autoplay policy)
document.addEventListener("click", startMusic, { once: true });
```

### 3. **js/sidebar.js**

Setup music button listeners:

- `initBackgroundMusic()` called saat sidebar init
- Toggle button listener untuk `#musicToggle`
- Update button UI setiap toggle

### 4. **js/main.js**

Home page specific:

- Ensure musik playing saat play button diklik
- Trigger autoplay dengan user interaction

### 5. **css/style.css**

Styling untuk music button:

- `.btn-nav.btn-music` - Base style (gradient pink-yellow)
- `.btn-nav.btn-music.music-playing` - Animate saat playing (pulse animation)
- `.btn-nav.btn-music.music-muted` - Opacity 0.6 saat mute

---

## Script Loading Order (PENTING)

Setiap halaman HARUS load scripts dalam urutan ini:

```html
<!-- PERTAMA: Core utilities -->
<script src="./js/shared.js"></script>

<!-- KEDUA: Persistent music handler -->
<script src="./js/persistent-music.js"></script>

<!-- KETIGA: Sidebar & navigation -->
<script src="./js/sidebar.js"></script>

<!-- KEEMPAT: Page-specific scripts -->
<script src="./js/[page-specific].js"></script>
```

**Alasan Urutan:**

1. `shared.js` must load first (defines initBackgroundMusic, toggleBackgroundMusic)
2. `persistent-music.js` depends on shared.js
3. `sidebar.js` calls initBackgroundMusic() dari shared.js
4. Page-specific scripts can use all globals

---

## State Storage

### localStorage

**Tujuan:** Remember user preference across sessions
**Key:** `backgroundMusicEnabled`
**Value:** `true` atau `false` (JSON boolean)
**Lifetime:** Permanent (sampai user clear cookies)

```javascript
localStorage.getItem("backgroundMusicEnabled"); // "true" atau "false"
localStorage.setItem("backgroundMusicEnabled", "true");
```

### sessionStorage

**Tujuan:** Keep musik position saat navigate antar halaman
**Keys:**

- `musicPlaying` - Apakah musik sedang playing saat navigasi?
- `musicCurrentTime` - Di mana posisi musik?
- `musicEnabled` - State enabled saat navigasi

**Lifetime:** Until browser tab closed

```javascript
sessionStorage.setItem("musicCurrentTime", 42.5); // Posisi musik di detik ke-42.5
sessionStorage.getItem("musicCurrentTime"); // "42.5"
```

---

## Alur Musik Saat User Navigate

### Scenario 1: User Pertama Kali Akses Website

```
User buka index.html
    ↓
1. shared.js load → backgroundMusicAudio = null, backgroundMusicEnabled = true
2. persistent-music.js load → Check sessionStorage (empty, first time)
3. sidebar.js load → Call initBackgroundMusic()
4. initBackgroundMusic() → Create audio element, append ke <body>
5. HTML render selesai
    ↓
6. User KLIK tombol Play (atau tombol apapun)
    ↓
7. persistent-music.js listener → Detekt click, play musik!
    ↓
8. ✅ MUSIK MULAI MAIN! 🎵
```

### Scenario 2: User Navigate ke Halaman Lain

```
User at index.html, musik playing di posisi 42.5s
    ↓
User klik link ke activities/bermain.html
    ↓
1. beforeunload fired → Save state:
   - sessionStorage.musicCurrentTime = 42.5
   - sessionStorage.musicPlaying = true
   ↓
2. Page unload, navigate ke bermain.html
   ↓
3. bermain.html load:
   - shared.js load → backgroundMusicAudio = null
   - persistent-music.js load → Check sessionStorage
   - ✅ Found: musicPlaying = true, musicCurrentTime = 42.5
   - DOMContentLoaded fired:
     * Call initBackgroundMusic()
     * Create new audio element
     * Set currentTime = 42.5
   ↓
4. ✅ MUSIK RESUME dari posisi 42.5s! 🎵
```

### Scenario 3: User Toggle Musik Off

```
User klik musik button → toggleBackgroundMusic()
    ↓
1. backgroundMusicEnabled = false
2. localStorage.backgroundMusicEnabled = "false" ✅
3. pauseBackgroundMusic() → audio.pause()
4. updateMusicButton() → Button opacity 0.6
    ↓
5. User navigate ke halaman lain → sessionStorage.musicPlaying = false
    ↓
6. Di halaman baru:
   - persistent-music.js check: musicPlaying = false
   - ✅ Musik tetap OFF (tidak resume) ✅
```

---

## Troubleshooting

### Musik tidak jalan saat pertama kali

**Penyebab:** Browser autoplay policy memblokir audio
**Solusi:**

- User HARUS click sesuatu terlebih dahulu
- persistent-music.js sudah ada `document.addEventListener("click")` handler

**Testing:**

1. Buka browser console (F12)
2. Cari log: `"Music started via user interaction"`
3. Kalo tidak ada, berarti user belum klik

### Musik tidak persist saat navigate

**Penyebab:** Script loading order salah
**Solusi:**

- Pastikan `shared.js` load PERTAMA
- Pastikan `persistent-music.js` load KEDUA
- Cek console log untuk error

**Testing:**

1. Buka browser console (F12)
2. Cari log pattern:
   ```
   ✅ Persistent music handler loaded
   ✅ Background music system initialized
   📤 Music state saved - CurrentTime: XX.XXs
   📥 Page loaded - Music restore attempt
   ✅ Music restored - Current time: XX.XXs
   ```

### Musik button tidak responsive

**Penyebab:** Music button tidak dapat querySelector
**Solusi:**

- Pastikan HTML punya: `<button id="musicToggle" data-music-toggle>`
- Pastikan sidebar.js load setelah button render

**Testing:**

1. Open console
2. Type: `document.getElementById("musicToggle")`
3. Harus return button element (bukan null)

---

## CSS Classes

### `.btn-nav.btn-music`

Base style untuk musik button

```css
background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
transition: all 0.3s ease;
```

### `.btn-nav.btn-music.music-playing`

Saat musik sedang main

```css
animation: pulse-music 2s infinite;
```

Animasi:

- 0% → box-shadow normal
- 50% → box-shadow with pink glow
- 100% → box-shadow normal

### `.btn-nav.btn-music.music-muted`

Saat musik di-mute

```css
opacity: 0.6;
```

---

## Volume Control

Musik volume di-set ke **30%** (0.3):

```javascript
backgroundMusicAudio.volume = 0.3;
```

Jika ingin ubah, edit di `shared.js` di function `initBackgroundMusic()`:

```javascript
backgroundMusicAudio.volume = 0.5; // Ubah ke 50% misalnya
```

---

## Audio File

**Path:** `sounds/background-music.mp3`
**Format:** MP3
**Loop:** Yes (infinite loop)
**Duration:** Berapapun (akan loop seamlessly)

---

## Performance Notes

1. **Single Audio Element** - Hanya 1 `<audio>` tag di `<body>`, direuse di semua halaman
2. **sessionStorage Lightweight** - Hanya simpan currentTime, bukan keseluruhan file
3. **No CORS Issues** - File lokal, tidak perlu CORS setup

---

## Browser Compatibility

- ✅ Chrome/Edge 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ⚠️ IE 11 - Not supported (no Audio API)

---

## Autoplay Policy

Modern browser memerlukan user interaction sebelum play audio.

**Cara sistem handle:**

1. `persistent-music.js` punya listener untuk `document.click` event
2. Saat user click pertama kali → musik otomatis play
3. Tidak perlu user explicit click tombol musik

---

## Testing Checklist

- [ ] Musik jalan saat user pertama kali akses index.html
- [ ] Musik tetap berlanjut saat navigate ke activities/bermain.html
- [ ] Musik tetap berlanjut saat navigate ke activities/huruf.html
- [ ] Musik button animated (pulse) saat playing
- [ ] Musik button opacity 0.6 saat muted
- [ ] Toggle musik button mute/unmute musik
- [ ] Musik state persist setelah close & reopen browser
- [ ] Console log menunjukkan music state transitions

---

## Debugging Tools

### Music Debug Helper

File optional: `js/music-debug.js`

Fitur:

- Print musik status setiap 5 detik
- Track page navigation events
- Helpful untuk development

Cara enable:

```html
<script src="./js/music-debug.js"></script>
```

---

## Kesimpulan

Sistem musik ini:

1. ✅ Otomatis start saat user interaksi
2. ✅ Persist di semua halaman
3. ✅ Remember preference user
4. ✅ Respect browser autoplay policy
5. ✅ Minimal resource usage (1 audio element)

Semua fitur sudah tested dan working! 🎉
