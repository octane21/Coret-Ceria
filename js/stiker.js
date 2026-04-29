// ===== STIKER / TAMBAH STIKER =====

let selectedStiker = null;
const stikerCanvas = document.querySelector(".stiker-canvas");

document.addEventListener("DOMContentLoaded", () => {
  initStiker();
});

function initStiker() {
  // Stiker buttons
  document.querySelectorAll(".stiker-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      selectedStiker = btn.dataset.stiker;
      document
        .querySelectorAll(".stiker-btn")
        .forEach((b) => (b.style.opacity = "0.5"));
      btn.style.opacity = "1";
    });
  });

  // First stiker as default
  const firstStiker = document.querySelector(".stiker-btn");
  if (firstStiker) {
    firstStiker.click();
  }

  // Click canvas to add stiker
  if (stikerCanvas) {
    stikerCanvas.addEventListener("click", (e) => {
      if (selectedStiker) {
        const stiker = document.createElement("span");
        stiker.textContent = selectedStiker;
        stiker.style.position = "absolute";
        stiker.style.fontSize = "40px";
        stiker.style.left = e.offsetX + "px";
        stiker.style.top = e.offsetY + "px";
        stiker.style.cursor = "pointer";

        // Click to remove
        stiker.addEventListener("click", (evt) => {
          stiker.remove();
          evt.stopPropagation();
        });

        stikerCanvas.appendChild(stiker);
      }
    });
  }

  // Clear button
  const clearBtn = document.querySelector("#stikerScreen .btn-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (stikerCanvas) {
        stikerCanvas.innerHTML = "";
      }
    });
  }
}

console.log("Stiker.js loaded!");
