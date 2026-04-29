// ===== MATERI PAGE =====

document.addEventListener("DOMContentLoaded", () => {
  initMateri();
});

function initMateri() {
  // Event listener untuk card Pengenalan Huruf
  const cardHuruf = document.getElementById("cardHuruf");
  if (cardHuruf) {
 
    cardHuruf.addEventListener("click", () => {
      window.location.href = "huruf.html";
          // Create audio element if it doesn't exist
 
    });
  }

  // Event listener untuk card Pengenalan Benda (Pengejaan Benda)
  const cardBenda = document.getElementById("cardBenda");
  if (cardBenda) {
    cardBenda.addEventListener("click", () => {
      window.location.href = "benda.html";
    });
  }
}


console.log("Materi.js loaded!");
