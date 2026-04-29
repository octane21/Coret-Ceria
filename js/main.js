// ===== MODULAR ARCHITECTURE =====
// Note: Activities are now separate HTML files in /activities/ folder
// This file only handles home page navigation

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("Home page loaded - index.html");

  // Note: initBackgroundMusic() dan music toggle sudah di-handle di sidebar.js
  // Jangan duplikasi di sini

  // Play button -> Navigate to activities/huruf.html
  const playBtn = document.getElementById("playBtn");
  const bannerContent = document.getElementById("bannerContent");
  const headerBanner = document.querySelector(".header-banner");
  const bannerActions = document.getElementById("bannerActions");

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      // 1) hide play button with animation
      playBtn.classList.add("hide");

      // 2) hide banner content (logo blocks and title)
      if (bannerContent) {
        bannerContent.classList.add("hide");
      }

      // 3) center the banner
      if (headerBanner) headerBanner.classList.add("centered");

      // 4) show action buttons inside banner
      if (bannerActions) {
        bannerActions.style.display = "flex";
        // small timeout to allow CSS transition
        setTimeout(() => {
          bannerActions.classList.add("show");
        }, 50);

        // wire buttons
        const btnBelajar = document.getElementById("btnBelajar");
        const btnBermain = document.getElementById("btnBermain");
        const btnKembali = document.getElementById("btnKembali");

        btnBelajar?.addEventListener("click", () => {
          window.location.href = "activities/materi.html";
        });

        btnBermain?.addEventListener("click", () => {
          window.location.href = "activities/bermain.html";
        });

        // Kembali button - reset to original state
        btnKembali?.addEventListener("click", () => {
          // 1) Hide action buttons first (smooth fade out + margin shrink)
          bannerActions.classList.remove("show");
          bannerActions.classList.add("hide");

          // 2) After buttons fade out AND margin transitions, start revealing original content
          setTimeout(() => {
            // Show banner content with smooth animation
            if (bannerContent) {
              bannerContent.classList.remove("hide");
              bannerContent.classList.add("show");
            }

            // Show play button with smooth animation
            playBtn.classList.remove("hide");
            playBtn.classList.add("show");

            bannerActions.style.display = "none";
            bannerActions.classList.remove("hide");
            // Move banner back to top position with smooth animation
            if (headerBanner) {
              headerBanner.classList.remove("centered");
              headerBanner.classList.add("center-revert");
            }
          }, 450);

          // 3) After animation completes, cleanup
          setTimeout(() => {
            bannerContent.classList.remove("show");
            playBtn.classList.remove("show");
            headerBanner.classList.remove("center-revert");
          }, 950);
        });
      }
    });
  }

  // Initialize home screen
  const homeScreen = document.getElementById("homeScreen");
  if (homeScreen) {
    homeScreen.classList.add("active");
  }
});
