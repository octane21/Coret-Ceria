/**
 * ===== SHARED UTILITIES =====
 * File ini berisi fungsi-fungsi yang digunakan oleh semua permainan
 * Bisa diakses dari file HTML terpisah
 */

// ===== SOUND/TEXT-TO-SPEECH =====
/**
 * Putar suara teks menggunakan Web Speech API
 * @param {string} text - Teks yang akan diucapkan
 * @param {string} lang - Bahasa (default: "id-ID" untuk Indonesia)
 */
function playSound(text, lang = "id-ID") {
  if ("speechSynthesis" in window) {
    // Stop jika ada yang sedang diputar
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }
}

// ===== BACKGROUND MUSIC SYSTEM =====
let backgroundMusicEnabled = true;
let backgroundMusicAudio = null;
let musicInitialized = false;

/**
 * Initialize background music
 * Harus dipanggil setelah DOM loaded
 * Musik akan terus berjalan di setiap halaman
 */
function initBackgroundMusic() {
  // Cek apakah sudah ada audio element di DOM (dari halaman sebelumnya)
  let existingAudio = document.getElementById("persistentBackgroundMusic");

  if (existingAudio) {
    // Gunakan audio element yang sudah ada (dari halaman sebelumnya)
    backgroundMusicAudio = existingAudio;
    console.log("✅ Reusing existing background music audio element");
    console.log(
      "🎵 Current time:",
      backgroundMusicAudio.currentTime.toFixed(2) + "s",
    );

    // JANGAN restart jika sudah playing
    if (!backgroundMusicAudio.paused) {
      console.log("✅ Musik sudah playing, lanjut dari posisi sebelumnya");
      // Update button state dan return
      updateMusicButton();
      return;
    }
  } else {
    // Buat audio element baru jika belum ada
    backgroundMusicAudio = new Audio();
    backgroundMusicAudio.id = "persistentBackgroundMusic";
    backgroundMusicAudio.preload = "auto";

    // Tentukan path yang benar berdasarkan lokasi halaman saat ini
    const isInActivity = window.location.pathname.includes("/activities/");
    const musicPath = isInActivity
      ? "../sounds/background-music.mp3"
      : "./sounds/background-music.mp3";

    backgroundMusicAudio.src = musicPath;
    backgroundMusicAudio.loop = true;
    backgroundMusicAudio.volume = 0.3; // Volume 30%

    // Append ke body agar persist antar halaman
    document.body.appendChild(backgroundMusicAudio);
    console.log(
      "📢 Created new background music audio element with path:",
      musicPath,
    );
  }

  // Load preferences dari localStorage
  const savedMusicState = localStorage.getItem("backgroundMusicEnabled");
  if (savedMusicState !== null) {
    backgroundMusicEnabled = JSON.parse(savedMusicState);
  } else {
    // Default: musik harus ON saat pertama kali
    backgroundMusicEnabled = true;
    localStorage.setItem("backgroundMusicEnabled", "true");
  }

  // Update button state
  updateMusicButton();

  // Mulai putar musik JIKA:
  // 1. Musik di-enable
  // 2. Audio masih paused (belum diplay)
  if (backgroundMusicEnabled && backgroundMusicAudio.paused) {
    console.log("▶️ Starting background music playback...");
    playBackgroundMusic();
  }

  // Mark sebagai initialized
  if (!musicInitialized) {
    musicInitialized = true;
    console.log("✅ Background music system initialized");
  }
}

/**
 * Mainkan background music
 */
function playBackgroundMusic() {
  if (backgroundMusicAudio && backgroundMusicEnabled) {
    const playPromise = backgroundMusicAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("✅ Music playing successfully");
        })
        .catch((err) => {
          console.log("⚠️ Autoplay blocked or error:", err.message);
          // Retry dengan muted attribute
          if (backgroundMusicAudio) {
            backgroundMusicAudio.muted = false;
            backgroundMusicAudio.play().catch((e) => {
              console.log("❌ Music play failed:", e.message);
            });
          }
        });
    }
  }
}

/**
 * Pause background music
 */
function pauseBackgroundMusic() {
  if (backgroundMusicAudio) {
    backgroundMusicAudio.pause();
  }
}

/**
 * Toggle background music
 */
function toggleBackgroundMusic() {
  backgroundMusicEnabled = !backgroundMusicEnabled;
  localStorage.setItem(
    "backgroundMusicEnabled",
    JSON.stringify(backgroundMusicEnabled),
  );

  if (backgroundMusicEnabled) {
    playBackgroundMusic();
  } else {
    pauseBackgroundMusic();
  }

  updateMusicButton();
}

/**
 * Update music button state
 */
function updateMusicButton() {
  const musicButton = document.querySelector("[data-music-toggle]");
  if (musicButton) {
    if (backgroundMusicEnabled) {
      musicButton.classList.remove("music-muted");
      musicButton.classList.add("music-playing");
      musicButton.title = "Musik Hidup (Klik untuk Matikan)";
    } else {
      musicButton.classList.remove("music-playing");
      musicButton.classList.add("music-muted");
      musicButton.title = "Musik Mati (Klik untuk Nyalakan)";
    }
  }
}

/**
 * Set background music volume
 * @param {number} volume - Volume 0-1
 */
function setBackgroundMusicVolume(volume) {
  if (backgroundMusicAudio) {
    backgroundMusicAudio.volume = Math.max(0, Math.min(1, volume));
  }
}

// ===== SCREEN/PAGE NAVIGATION =====
/**
 * Navigasi ke halaman permainan lain
 * Gunakan untuk membuka aktivitas dari HTML terpisah
 * @param {string} activityName - Nama aktivitas atau path URL lengkap (coloring, activities/materi.html, dll)
 */
function navigateToActivity(activityName) {
  // Jika sudah full path, langsung redirect
  if (activityName.includes("/") || activityName.includes(".html")) {
    window.location.href = activityName;
    return;
  }

  // Jika hanya nama activity, gunakan mapping
  const activities = {
    coloring: "activities/coloring.html",
    drawing: "activities/drawing.html",
    huruf: "activities/huruf.html",
    dots: "activities/dots.html",
    stiker: "activities/stiker.html",
    game: "activities/game.html",
    materi: "activities/materi.html",
  };

  if (activities[activityName]) {
    window.location.href = activities[activityName];
  }
}

/**
 * Kembali ke halaman utama/home
 */
function goHome() {
  window.location.href = "../index.html";
}

// ===== UTILITY FUNCTIONS =====
/**
 * Get element dengan fallback
 * @param {string} id - ID element
 * @return {Element|null}
 */
function getElement(id) {
  return document.getElementById(id) || null;
}

/**
 * Get all elements dengan selector
 * @param {string} selector - CSS selector
 * @return {NodeList}
 */
function getElements(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Toggle class pada element
 * @param {Element} element - Element target
 * @param {string} className - Nama class
 */
function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }
}

/**
 * Add class pada element
 * @param {Element} element - Element target
 * @param {string} className - Nama class
 */
function addClass(element, className) {
  if (element) {
    element.classList.add(className);
  }
}

/**
 * Remove class dari element
 * @param {Element} element - Element target
 * @param {string} className - Nama class
 */
function removeClass(element, className) {
  if (element) {
    element.classList.remove(className);
  }
}

// ===== CANVAS UTILITIES =====
/**
 * Clear canvas
 * @param {Canvas} canvas - Canvas element
 * @param {string} fillColor - Warna background (default: white)
 */
function clearCanvas(canvas, fillColor = "#ffffff") {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Set canvas size dari container
 * @param {Canvas} canvas - Canvas element
 * @param {Element} container - Container element
 * @param {number} height - Fixed height (optional)
 */
function setCanvasSize(canvas, container, height = 400) {
  if (!canvas || !container) return;

  canvas.width = container.clientWidth - 20;
  canvas.height = height;

  clearCanvas(canvas);
}

// ===== STORAGE UTILITIES =====
/**
 * Save data ke localStorage
 * @param {string} key - Key untuk menyimpan
 * @param {*} value - Value yang disimpan
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Get data dari localStorage
 * @param {string} key - Key untuk diambil
 * @param {*} defaultValue - Default value jika key tidak ada
 * @return {*}
 */
function getFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
}

/**
 * Remove data dari localStorage
 * @param {string} key - Key untuk dihapus
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

// ===== ANIMATION UTILITIES =====
/**
 * Simple fade in animation
 * @param {Element} element - Element target
 * @param {number} duration - Durasi animasi (ms)
 */
function fadeIn(element, duration = 300) {
  if (!element) return;

  element.style.opacity = "0";
  element.style.transition = `opacity ${duration}ms ease-in`;
  element.offsetHeight; // Trigger reflow

  element.style.opacity = "1";
}

/**
 * Simple fade out animation
 * @param {Element} element - Element target
 * @param {number} duration - Durasi animasi (ms)
 */
function fadeOut(element, duration = 300) {
  if (!element) return;

  element.style.opacity = "1";
  element.style.transition = `opacity ${duration}ms ease-out`;
  element.offsetHeight; // Trigger reflow

  element.style.opacity = "0";
}

// ===== EVENT UTILITIES =====
/**
 * Add event listener dengan fallback
 * @param {Element} element - Element target
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
function onEvent(element, event, handler) {
  if (element) {
    element.addEventListener(event, handler);
  }
}

/**
 * Remove event listener
 * @param {Element} element - Element target
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
function offEvent(element, event, handler) {
  if (element) {
    element.removeEventListener(event, handler);
  }
}

// ===== DEBUG UTILITIES =====
/**
 * Log dengan prefix
 * @param {string} prefix - Prefix untuk log
 * @param {*} data - Data yang dilog
 */
function debugLog(prefix, data) {
  console.log(`[${prefix}]`, data);
}

/**
 * Error log
 * @param {string} prefix - Prefix untuk log
 * @param {*} error - Error yang dilog
 */
function errorLog(prefix, error) {
  console.error(`[${prefix}] ERROR:`, error);
}

// ===== KEYBOARD UTILITIES =====
/**
 * Handle keyboard shortcut
 * @param {Array<string>} keys - Array of keys (e.g., ['Escape'])
 * @param {Function} callback - Callback function
 */
function onKeyDown(keys, callback) {
  document.addEventListener("keydown", (e) => {
    if (keys.includes(e.key)) {
      callback(e);
    }
  });
}

// Export untuk digunakan di modul lain (jika menggunakan module system)
// Tapi karena HTML langsung load script, semua fungsi akan global
