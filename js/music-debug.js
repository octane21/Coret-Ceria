// ===== MUSIC DEBUG HELPER =====
// Helper untuk track musik state across pages
// Load setelah shared.js dan persistent-music.js

(function () {
  console.log("=== MUSIC DEBUG HELPER ===");

  // Monitor musik state setiap 2 detik
  setInterval(() => {
    if (window.backgroundMusicAudio) {
      console.log(
        `🎵 Music Status:`,
        `Enabled: ${window.backgroundMusicEnabled}`,
        `Paused: ${window.backgroundMusicAudio.paused}`,
        `Current Time: ${window.backgroundMusicAudio.currentTime.toFixed(2)}s`,
        `Volume: ${window.backgroundMusicAudio.volume}`,
      );
    } else {
      console.log("🎵 Music Audio element not found");
    }
  }, 5000); // Every 5 seconds

  // Track page navigation
  window.addEventListener("beforeunload", () => {
    if (window.backgroundMusicAudio && !window.backgroundMusicAudio.paused) {
      console.log(
        "📤 Leaving page - Music saved at:",
        window.backgroundMusicAudio.currentTime.toFixed(2) + "s",
      );
    }
  });

  window.addEventListener("pageshow", () => {
    console.log("📥 Page loaded - Music restore attempt");
    setTimeout(() => {
      if (window.backgroundMusicAudio) {
        console.log(
          "✅ Music restored - Current time:",
          window.backgroundMusicAudio.currentTime.toFixed(2) + "s",
        );
      }
    }, 100);
  });

  console.log("Music debug helper loaded");
})();
