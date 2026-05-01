// ===== PERSISTENT MUSIC HANDLER =====
// File ini memastikan musik terus berjalan saat navigasi antar halaman
// Musik TIDAK restart saat pindah halaman, tetap lanjut dari posisi terakhir
// Harus di-load di SEMUA halaman sebelum halaman berpindah

(function () {
  console.log("📢 Persistent music handler initializing...");

  // Global untuk track music across pages
  window.musicStateAcrossPages = window.musicStateAcrossPages || {
    isPlaying: false,
    currentTime: 0,
    lastCheckTime: Date.now(),
  };

  // ===== SAVE MUSIC STATE SEBELUM NAVIGASI =====
  const saveMusicalState = function () {
    if (window.backgroundMusicAudio) {
      const isPlaying = !window.backgroundMusicAudio.paused;
      const currentTime = window.backgroundMusicAudio.currentTime;

      // Update global state
      window.musicStateAcrossPages.isPlaying = isPlaying;
      window.musicStateAcrossPages.currentTime = currentTime;
      window.musicStateAcrossPages.lastCheckTime = Date.now();

      // Juga simpan ke sessionStorage sebagai backup
      sessionStorage.setItem("musicCurrentTime", currentTime.toString());
      sessionStorage.setItem("musicPlaying", isPlaying.toString());
      sessionStorage.setItem(
        "musicEnabled",
        JSON.stringify(window.backgroundMusicEnabled),
      );

      console.log("📤 Music state saved:");
      console.log(`   - Playing: ${isPlaying}`);
      console.log(`   - Position: ${currentTime.toFixed(2)}s`);
    }
  };

  // ===== RESTORE MUSIC STATE SETELAH NAVIGATE =====
  const restoreMusicState = function () {
    if (!window.initBackgroundMusic) {
      console.log("⚠️ initBackgroundMusic not available yet");
      return;
    }

    // Initialize musik system
    window.initBackgroundMusic();

    // Tunggu audio element ready
    setTimeout(() => {
      if (window.backgroundMusicAudio) {
        const savedTime =
          parseFloat(sessionStorage.getItem("musicCurrentTime")) || 0;
        const wasPlaying = sessionStorage.getItem("musicPlaying") === "true";

        // Restore posisi
        if (savedTime > 0) {
          window.backgroundMusicAudio.currentTime = savedTime;
          console.log(
            "📥 Music position restored: " + savedTime.toFixed(2) + "s",
          );
        }

        // Jika sebelumnya playing, pastikan terus playing
        if (wasPlaying && window.backgroundMusicAudio.paused) {
          console.log("▶️ Resuming music after page navigation...");
          window.playBackgroundMusic();
        }
      }
    }, 50);
  };

  // ===== EVENT LISTENERS =====

  // Save state sebelum navigasi
  window.addEventListener("beforeunload", saveMusicalState);
  window.addEventListener("pagehide", saveMusicalState);

  // Restore saat page load
  window.addEventListener("pageshow", function (event) {
    console.log("📥 Page shown - attempting music restore");
    restoreMusicState();
  });

  // Untuk initial page load (tidak dari history)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("📥 DOM loaded - initializing music");

      // Check apakah ada state dari halaman sebelumnya
      const wasPlaying = sessionStorage.getItem("musicPlaying") === "true";

      if (wasPlaying) {
        console.log("📝 Previous page had music playing, will restore");
        restoreMusicState();
      } else {
        // First time load, just initialize normal
        if (window.initBackgroundMusic) {
          window.initBackgroundMusic();
        }
      }
    });
  } else {
    // DOM sudah loaded
    console.log("📥 DOM already loaded - initializing music");
    const wasPlaying = sessionStorage.getItem("musicPlaying") === "true";

    if (wasPlaying) {
      restoreMusicState();
    }
  }

  console.log("✅ Persistent music handler loaded");
})();
