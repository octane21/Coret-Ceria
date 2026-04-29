// ===== BERMAIN PAGE =====

document.addEventListener("DOMContentLoaded", () => {
  initBermain();
});

function initBermain() {
  // Event listener untuk card Mewarnai Benda
  const cardMewarnai = document.getElementById("cardMewarnai");
  if (cardMewarnai) {
    cardMewarnai.addEventListener("click", () => {
      window.location.href = "coloring-benda.html";
    });
  }

  // Event listener untuk card Penyusunan Huruf
  const cardSusun = document.getElementById("cardSusun");
  if (cardSusun) {
    cardSusun.addEventListener("click", () => {
      window.location.href = "susun.html";
    });
  }
}

console.log("Bermain.js loaded!");
