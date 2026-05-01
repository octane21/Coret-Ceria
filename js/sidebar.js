// ===== SIDEBAR NAVIGATION CONTROL =====

let isSoundMuted = false;
let currentAudio = null;

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
});

function initSidebar() {
  console.log("🎯 Initializing sidebar...");

  // Setup hamburger toggle button for mobile
  const hamburgerBtn = document.getElementById("hamburgerToggle");
  const navMenu = document.getElementById("navMenu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a nav item
    navMenu.querySelectorAll(".btn-nav").forEach((btn) => {
      btn.addEventListener("click", () => {
        navMenu.classList.remove("active");
      });
    });
  }

  // Initialize background music - CRITICAL
  // Pastikan musik sudah ada sebelum setup button
  if (window.initBackgroundMusic) {
    window.initBackgroundMusic();
    console.log("✅ Background music initialized from sidebar");
  }

  // Setup music button - HARUS setelah initBackgroundMusic
  const musicBtn = document.getElementById("musicToggle");
  if (musicBtn) {
    musicBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🎵 Music toggle clicked");
      window.toggleBackgroundMusic();
    });
  }

  // Setup home button
  const homeBtn = document.querySelector(".btn-nav.btn-home");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => goHome());
  }

  // Setup back button
  const backBtn = document.querySelector(".btn-nav.btn-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => goBack());
  }

  console.log("✅ Sidebar initialized");
}

function stopAllAudio() {
  // Stop letter audio
  const letterAudio = document.getElementById("letterAudio");
  if (letterAudio) {
    letterAudio.pause();
    letterAudio.currentTime = 0;
  }

  // Stop any other audio elements
  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function canPlaySound() {
  return !isSoundMuted;
}

function goHome() {
  // Detect if we're in activities folder or root
  const currentPath = window.location.pathname;
  if (currentPath.includes("/activities/")) {
    window.location.href = "../index.html";
  } else {
    // Already on home or root, do nothing
    window.location.href = "./index.html";
  }
}

function goBack() {
  // Try to go back in history
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // If no history, go to home
    goHome();
  }
}

console.log("Sidebar.js loaded!");
