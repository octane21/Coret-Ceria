// ===== COLORING / MEWARNAI - HEWAN DAN PENGEJAAN =====

let coloringColor = "#FF6B6B";
let coloringCanvas = null;
let coloringCtx = null;
let currentAnimal = null;
let isDrawingColoring = false;
let lastXColoring = 0;
let lastYColoring = 0;
let coloredPixelCount = 0;
let coloringThreshold = 10; // Set to 10% from start
let coloringStarted = false;
let completionTriggered = false; // Flag untuk track apakah completion sudah ditrigger
let drawStrokeCount = 0; // Counter untuk tracking

// Data Hewan dengan Gambar dan Pengejaan
const animals = {
  cat: {
    name: "Kucing",
    spelling: "K-U-C-I-N-G",
    drawFunction: drawCat,
  },
  dog: {
    name: "Anjing",
    spelling: "A-N-J-I-N-G",
    drawFunction: drawDog,
  },
  fish: {
    name: "Ikan",
    spelling: "I-K-A-N",
    drawFunction: drawFish,
  },
  bird: {
    name: "Burung",
    spelling: "B-U-R-U-N-G",
    drawFunction: drawBird,
  },
  butterfly: {
    name: "Kupu-kupu",
    spelling: "K-U-P-U-K-U-P-U",
    drawFunction: drawButterfly,
  },
  turtle: {
    name: "Kura-kura",
    spelling: "K-U-R-A-K-U-R-A",
    drawFunction: drawTurtle,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initColoring();
});

function initColoring() {
  // Setup canvas
  coloringCanvas = document.getElementById("coloringCanvas");
  if (!coloringCanvas) return;

  coloringCtx = coloringCanvas.getContext("2d");

  // Set canvas size
  const container = document.querySelector(".coloring-area");
  if (container) {
    coloringCanvas.width = Math.min(container.clientWidth - 20, 500);
    coloringCanvas.height = 400;
  }

  // Draw default animal (cat)
  selectAnimal("cat");

  // ===== ANIMAL SELECTOR =====
  document.querySelectorAll(".animal-select-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const animalId = e.target.closest(".animal-select-btn").dataset.animal;
      selectAnimal(animalId);
    });
  });

  // ===== COLOR PALETTE =====
  document.querySelectorAll("#coloringScreen .color-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document
        .querySelectorAll("#coloringScreen .color-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      coloringColor = e.target.dataset.color;
    });
  });

  // First color as default
  const firstColor = document.querySelector("#coloringScreen .color-btn");
  if (firstColor) {
    firstColor.classList.add("active");
  }

  // ===== CANVAS DRAWING EVENTS =====
  coloringCanvas.addEventListener("mousedown", startDrawing);
  coloringCanvas.addEventListener("mousemove", draw);
  coloringCanvas.addEventListener("mouseup", stopDrawing);
  coloringCanvas.addEventListener("mouseout", stopDrawing);

  // Touch support
  coloringCanvas.addEventListener("touchstart", handleTouch);
  coloringCanvas.addEventListener("touchmove", handleTouch);
  coloringCanvas.addEventListener("touchend", stopDrawing);

  // ===== BRUSH SIZE =====
  const brushSlider = document.getElementById("brushSize");
  if (brushSlider) {
    brushSlider.addEventListener("input", (e) => {
      // Update in real-time
    });
  }

  // ===== CLEAR BUTTON =====
  const clearBtn = document.querySelector("#coloringScreen .btn-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearColoring();
    });
  }

  // ===== SPEAK BUTTON =====
  const speakBtn = document.getElementById("speakAnimalBtn");
  if (speakBtn) {
    speakBtn.addEventListener("click", () => {
      if (currentAnimal) {
        const animal = animals[currentAnimal];
        playSound(animal.name, "id-ID");
      }
    });
  }

  // ===== NEXT ANIMAL BUTTON =====
  const nextAnimalBtn = document.querySelector(".btn-next-animal");
  if (nextAnimalBtn) {
    nextAnimalBtn.addEventListener("click", () => {
      moveToNextAnimal();
    });
  }
}

function selectAnimal(animalId) {
  if (!animals[animalId]) return;

  currentAnimal = animalId;
  const animal = animals[animalId];

  // Update UI
  document.querySelectorAll(".animal-select-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .querySelector(`.animal-select-btn[data-animal="${animalId}"]`)
    ?.classList.add("active");

  document.getElementById("animalNameText").textContent = animal.name;
  document.getElementById("animalNameInfo").textContent = animal.name;
  document.getElementById("animalSpellingInfo").textContent = animal.spelling;

  // Clear canvas and draw animal
  clearColoring();
  animal.drawFunction();

  // Reset completion state
  completionTriggered = false;
  drawStrokeCount = 0;

  // Hide completion message
  const completeDiv = document.getElementById("coloringComplete");
  if (completeDiv) {
    completeDiv.style.display = "none";
  }

  console.log(`[Coloring] Selected: ${animal.name}`);
}

function startDrawing(e) {
  const rect = coloringCanvas.getBoundingClientRect();
  lastXColoring = e.clientX - rect.left;
  lastYColoring = e.clientY - rect.top;
  isDrawingColoring = true;
}

function draw(e) {
  if (!isDrawingColoring) return;

  const rect = coloringCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  coloringCtx.strokeStyle = coloringColor;
  coloringCtx.lineWidth = document.getElementById("brushSize").value;
  coloringCtx.lineCap = "round";
  coloringCtx.lineJoin = "round";

  coloringCtx.beginPath();
  coloringCtx.moveTo(lastXColoring, lastYColoring);
  coloringCtx.lineTo(x, y);
  coloringCtx.stroke();

  lastXColoring = x;
  lastYColoring = y;

  drawStrokeCount++;

  // Check completion setiap 5 stroke untuk performance
  // Dan jika belum triggered
  if (drawStrokeCount % 5 === 0 && !completionTriggered) {
    const percentage = getColoringPercentage();

    // Debug log
    if (drawStrokeCount % 50 === 0) {
      console.log(
        `[Coloring] Strokes: ${drawStrokeCount}, Colored: ${percentage}%, Threshold: ${coloringThreshold}%`,
      );
    }

    // Check untuk completion
    if (percentage >= coloringThreshold) {
      console.log(
        `[Coloring] ✅ COMPLETION TRIGGERED! ${percentage}% >= ${coloringThreshold}%`,
      );
      showColoringComplete();
      completionTriggered = true;
    }
  }
}

function stopDrawing() {
  isDrawingColoring = false;
}

function handleTouch(e) {
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent(
    e.type === "touchstart" ? "mousedown" : "mousemove",
    {
      clientX: touch.clientX,
      clientY: touch.clientY,
    },
  );
  coloringCanvas.dispatchEvent(mouseEvent);
}

function clearColoring() {
  if (coloringCtx && coloringCanvas) {
    coloringCtx.fillStyle = "white";
    coloringCtx.fillRect(0, 0, coloringCanvas.width, coloringCanvas.height);

    // Redraw animal outline
    if (currentAnimal) {
      const animal = animals[currentAnimal];
      animal.drawFunction();
    }

    // Reset completion state
    completionTriggered = false;
    drawStrokeCount = 0;

    // Hide completion message
    const completeDiv = document.getElementById("coloringComplete");
    if (completeDiv) {
      completeDiv.style.display = "none";
    }

    console.log(`[Coloring] Canvas cleared and reset`);
  }
}

function moveToNextAnimal() {
  const animalIds = Object.keys(animals);
  const currentIndex = animalIds.indexOf(currentAnimal);
  const nextIndex = (currentIndex + 1) % animalIds.length;
  selectAnimal(animalIds[nextIndex]);
}

// ===== ANIMAL DRAWING FUNCTIONS =====

function drawCat() {
  const ctx = coloringCtx;
  const w = coloringCanvas.width / 2;
  const h = coloringCanvas.height / 2;

  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;

  // Head
  ctx.beginPath();
  ctx.arc(w, h - 20, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.moveTo(w - 45, h - 70);
  ctx.lineTo(w - 55, h - 100);
  ctx.lineTo(w - 35, h - 80);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w + 45, h - 70);
  ctx.lineTo(w + 55, h - 100);
  ctx.lineTo(w + 35, h - 80);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Eyes
  ctx.beginPath();
  ctx.arc(w - 20, h - 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(w + 20, h - 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Nose
  ctx.beginPath();
  ctx.arc(w, h - 10, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#ff69b4";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // Mouth
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w, h, 15, 0, Math.PI);
  ctx.stroke();

  // Whiskers
  ctx.beginPath();
  ctx.moveTo(w - 60, h - 10);
  ctx.lineTo(w - 90, h - 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w + 60, h - 10);
  ctx.lineTo(w + 90, h - 10);
  ctx.stroke();

  // Body
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(w, h + 80, 50, 70, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w + 40, h + 100);
  ctx.quadraticCurveTo(w + 80, h + 80, w + 70, h + 30);
  ctx.stroke();
}

function drawDog() {
  const ctx = coloringCtx;
  const w = coloringCanvas.width / 2;
  const h = coloringCanvas.height / 2;

  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;

  // Head
  ctx.beginPath();
  ctx.ellipse(w, h - 30, 55, 65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.ellipse(w - 50, h - 60, 25, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(w + 50, h - 60, 25, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Snout
  ctx.beginPath();
  ctx.ellipse(w, h, 40, 35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eyes
  ctx.beginPath();
  ctx.arc(w - 25, h - 40, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(w + 25, h - 40, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Nose
  ctx.beginPath();
  ctx.arc(w, h + 5, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  // Mouth
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w, h + 5);
  ctx.lineTo(w, h + 20);
  ctx.stroke();

  // Body
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(w, h + 90, 45, 65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(w + 40, h + 100);
  ctx.quadraticCurveTo(w + 70, h + 60, w + 60, h + 20);
  ctx.stroke();

  // Legs
  ctx.lineWidth = 4;
  for (let i = -1; i <= 1; i += 2) {
    ctx.beginPath();
    ctx.moveTo(w + i * 20, h + 160);
    ctx.lineTo(w + i * 20, h + 200);
    ctx.stroke();
  }
}

function drawFish() {
  const ctx = coloringCtx;
  const w = coloringCanvas.width / 2;
  const h = coloringCanvas.height / 2;

  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;

  // Body
  ctx.beginPath();
  ctx.ellipse(w - 10, h, 70, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(w - 60, h, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eye
  ctx.beginPath();
  ctx.arc(w - 70, h - 10, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  // Mouth
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w - 50, h, 10, 0, Math.PI);
  ctx.stroke();

  // Tail
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w + 60, h);
  ctx.lineTo(w + 100, h - 40);
  ctx.lineTo(w + 85, h);
  ctx.lineTo(w + 100, h + 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dorsal fin
  ctx.beginPath();
  ctx.moveTo(w - 20, h - 45);
  ctx.lineTo(w, h - 70);
  ctx.lineTo(w + 10, h - 45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Belly fin
  ctx.beginPath();
  ctx.arc(w - 10, h + 50, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawBird() {
  const ctx = coloringCtx;
  const w = coloringCanvas.width / 2;
  const h = coloringCanvas.height / 2;

  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;

  // Head
  ctx.beginPath();
  ctx.arc(w, h - 30, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.ellipse(w, h + 20, 40, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eye
  ctx.beginPath();
  ctx.arc(w + 15, h - 35, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  // Beak
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w + 25, h - 30);
  ctx.lineTo(w + 45, h - 25);
  ctx.lineTo(w + 25, h - 20);
  ctx.closePath();
  ctx.stroke();

  // Wings
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(w - 30, h + 10, 35, 30, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tail feathers
  ctx.beginPath();
  ctx.moveTo(w, h + 70);
  ctx.lineTo(w - 30, h + 100);
  ctx.lineTo(w - 10, h + 85);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w + 10, h + 70);
  ctx.lineTo(w + 40, h + 100);
  ctx.lineTo(w + 20, h + 85);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Legs
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w - 15, h + 70);
  ctx.lineTo(w - 15, h + 95);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w + 15, h + 70);
  ctx.lineTo(w + 15, h + 95);
  ctx.stroke();
}

function drawButterfly() {
  const ctx = coloringCtx;
  const w = coloringCanvas.width / 2;
  const h = coloringCanvas.height / 2;

  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;

  // Upper wings
  ctx.beginPath();
  ctx.ellipse(w - 50, h - 40, 40, 50, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(w + 50, h - 40, 40, 50, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Lower wings
  ctx.beginPath();
  ctx.ellipse(w - 40, h + 40, 30, 40, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(w + 40, h + 40, 30, 40, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.ellipse(w, h, 12, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(w, h - 50, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Antennae
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w - 5, h - 65);
  ctx.quadraticCurveTo(w - 20, h - 100, w - 10, h - 110);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w + 5, h - 65);
  ctx.quadraticCurveTo(w + 20, h - 100, w + 10, h - 110);
  ctx.stroke();

  // Wing patterns
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.arc(w - 50, h - 40, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w + 50, h - 40, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawTurtle() {
  const ctx = coloringCtx;
  const w = coloringCanvas.width / 2;
  const h = coloringCanvas.height / 2;

  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 3;

  // Shell
  ctx.beginPath();
  ctx.ellipse(w, h - 20, 70, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Shell pattern (hexagons)
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.arc(w - 30, h - 30, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w + 30, h - 30, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w, h - 10, 15, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(w, h + 50, 35, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eyes
  ctx.beginPath();
  ctx.arc(w - 15, h + 35, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w + 15, h + 35, 6, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w, h + 55, 10, 0, Math.PI);
  ctx.stroke();

  // Legs
  ctx.lineWidth = 4;
  for (let i = -1; i <= 1; i += 2) {
    ctx.beginPath();
    ctx.moveTo(w + i * 40, h + 15);
    ctx.lineTo(w + i * 60, h + 50);
    ctx.stroke();
  }

  // Tail
  ctx.beginPath();
  ctx.moveTo(w, h - 80);
  ctx.quadraticCurveTo(w + 20, h - 110, w + 15, h - 130);
  ctx.stroke();
}

// ===== COMPLETION DETECTION FUNCTIONS =====

/**
 * Check if the animal has been sufficiently colored
 * Analyzes pixel data to see how much color has been added
 */
function checkColoringCompletion() {
  if (!coloringCanvas || !coloringCtx || !currentAnimal) return false;

  try {
    // Set threshold if not set
    if (coloringThreshold === 0) {
      coloringThreshold = 10; // 10% threshold untuk completion (lebih mudah)
    }

    // Get image data dari canvas
    const imageData = coloringCtx.getImageData(
      0,
      0,
      coloringCanvas.width,
      coloringCanvas.height,
    );
    const data = imageData.data;

    let coloredPixels = 0;
    let totalPixels = data.length / 4; // 4 bytes per pixel (RGBA)

    // Analisis setiap pixel
    // Lebih cepat dengan increment 4 (skip ke pixel berikutnya)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]; // Red
      const g = data[i + 1]; // Green
      const b = data[i + 2]; // Blue
      const a = data[i + 3]; // Alpha

      // Pixel dianggap "colored" jika:
      // 1. Ada nilai alpha (tidak transparent)
      // 2. Bukan warna putih murni (255,255,255)
      // 3. Bukan warna hitam outline murni (bukan R==G==B && high value)

      const hasAlpha = a > 50; // Ada transparency
      const isNotWhite = !(r === 255 && g === 255 && b === 255); // Bukan putih
      const isNotPureOutline = !(r === g && g === b && r > 150); // Bukan outline hitam/abu

      // Pixel terhitung sebagai "warna" jika memenuhi semua kondisi
      if (hasAlpha && isNotWhite && isNotPureOutline) {
        coloredPixels++;
      }
    }

    // Hitung persentase
    const coloredPercentage = (coloredPixels / totalPixels) * 100;

    // Debug log (bisa dihapus jika sudah production)
    // console.log(`Coloring percentage: ${coloredPercentage.toFixed(2)}% (threshold: ${coloringThreshold}%)`);

    return coloredPercentage >= coloringThreshold;
  } catch (error) {
    console.error("Error checking coloring completion:", error);
    return false;
  }
}

/**
 * Get current coloring percentage
 */
function getColoringPercentage() {
  if (!coloringCanvas || !coloringCtx || !currentAnimal) return 0;

  try {
    const imageData = coloringCtx.getImageData(
      0,
      0,
      coloringCanvas.width,
      coloringCanvas.height,
    );
    const data = imageData.data;

    let coloredPixels = 0;
    let totalAnalyzedPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      const isWhite = r === 255 && g === 255 && b === 255;
      const isTransparent = a < 100;
      const isOutlineOnly = r === g && g === b && r > 100;

      if (!isWhite && !isTransparent && !isOutlineOnly) {
        coloredPixels++;
      }
      totalAnalyzedPixels++;
    }

    return Math.round((coloredPixels / totalAnalyzedPixels) * 100);
  } catch (error) {
    return 0;
  }
}

/**
 * Show completion message and play spelling
 */
function showColoringComplete() {
  const completeDiv = document.getElementById("coloringComplete");

  if (completeDiv) {
    // Tampilkan div
    completeDiv.style.display = "flex";
    completeDiv.style.animation = "none"; // Reset animation

    // Trigger repaint untuk animation
    void completeDiv.offsetWidth;

    // Apply animation
    completeDiv.style.animation = "slideUp 0.5s ease-out";

    // Trigger audio spelling otomatis
    setTimeout(() => {
      const speakBtn = document.getElementById("speakAnimalBtn");
      if (speakBtn) {
        speakBtn.click();
      }
    }, 300); // Delay sedikit untuk effect yang lebih baik
  }
}

console.log("Coloring.js dengan Hewan dan Pengejaan loaded!");
