// ===== PERSISTENT MUSIC HANDLER =====
// File ini memastikan musik terus berjalan saat navigasi antar halaman
// Harus di-load di SEMUA halaman sebelum halaman berpindah

(function () {
  // Save music state before page unload
  window.addEventListener("beforeunload", function () {
    if (backgroundMusicAudio && !backgroundMusicAudio.paused) {
      // Simpan current time musik ke sessionStorage
      sessionStorage.setItem(
        "musicCurrentTime",
        backgroundMusicAudio.currentTime,
      );
      console.log("Music paused at:", backgroundMusicAudio.currentTime);
    }
  });

  // Prevent audio element dari dihapus saat navigasi
  window.addEventListener("pagehide", function () {
    // Audio element akan tetap ada di DOM dan tidak dihapus
    console.log("Page hidden - music continues playing");
  });

  // Resume music setelah halaman load
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      console.log("Page restored from history - music should resume");
      // Musik akan otomatis resume karena audio element masih ada
      setTimeout(() => {
        initBackgroundMusic();
      }, 100);
    }
  });
})();
