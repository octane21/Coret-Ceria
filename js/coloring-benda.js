// ===== MEWARNAI BENDA - DENGAN GAMBAR REALISTIS DAN DETEKSI WARNA =====

let bendaColoringCanvas = null;
let bendaColoringCtx = null;
let coloringProgressCanvas = null; // Canvas tambahan untuk tracking warna
let currentBendaColoring = null;
let isDrawingBendaColoring = false;
let currentColorBenda = "#FF6B6B";
let brushSizeBenda = 10;
let coloredPixelsBenda = 0;
let originalImageData = null;
let outlineImageData = null; // Simpan data outline saja
let coloringPercentage = 0; // Tracking persentase coloring
const COLORING_THRESHOLD = 70; // Minimum 70% harus diwarnai

// Data Benda dengan Gambar SVG Realistis
const bendaColoringData = {
  kursi: {
    name: "Kursi",
    spelling: "K-U-R-S-I",
    drawFunction: drawChairRealistic,
  },
  meja: {
    name: "Meja",
    spelling: "M-E-J-A",
    drawFunction: drawTableRealistic,
  },
  pintu: {
    name: "Pintu",
    spelling: "P-I-N-T-U",
    drawFunction: drawDoorRealistic,
  },
  jendela: {
    name: "Jendela",
    spelling: "J-E-N-D-E-L-A",
    drawFunction: drawWindowRealistic,
  },
  buku: {
    name: "Buku",
    spelling: "B-U-K-U",
    drawFunction: drawBookRealistic,
  },
  pensil: {
    name: "Pensil",
    spelling: "P-E-N-S-I-L",
    drawFunction: drawPencilRealistic,
  },
  bunga: {
    name: "Bunga",
    spelling: "B-U-N-G-A",
    drawFunction: drawFlowerRealistic,
  },
  bola: {
    name: "Bola",
    spelling: "B-O-L-A",
    drawFunction: drawBallRealistic,
  },
};

const bendaIcons = {
  kursi: "🪑",
  meja: "🪑",
  pintu: "🚪",
  jendela: "🪟",
  buku: "📚",
  pensil: "✏️",
  bunga: "🌸",
  bola: "⚽",
};

document.addEventListener("DOMContentLoaded", () => {
  initBendaColoring();
});

function initBendaColoring() {
  // Setup Canvas
  bendaColoringCanvas = document.getElementById("bendaColoringCanvas");
  bendaColoringCtx = bendaColoringCanvas.getContext("2d");

  // Set canvas size
  bendaColoringCanvas.width = 600;
  bendaColoringCanvas.height = 500;

  // Selection items
  const bendaItems = document.querySelectorAll(".coloring-benda-item");
  bendaItems.forEach((item) => {
    item.addEventListener("click", () => {
      const bendaKey = item.getAttribute("data-benda");
      startBendaColoring(bendaKey);
    });
  });

  // Color buttons
  const colorBtns = document.querySelectorAll(".color-btn-benda");
  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      currentColorBenda = color;
      colorBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Brush size
  const brushSlider = document.getElementById("brushSizeBenda");
  if (brushSlider) {
    brushSlider.addEventListener("input", (e) => {
      brushSizeBenda = parseInt(e.target.value);
    });
  }

  // Clear button
  const clearBtn = document.getElementById("clearBendaBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearBendaColoring();
    });
  }

  // Finish button
  const finishBtn = document.getElementById("finishColoringBtn");
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      checkColoringCompletion();
    });
  }

  // Speak button
  const speakBtn = document.getElementById("speakBendaBtn");
  if (speakBtn) {
    speakBtn.addEventListener("click", () => {
      if (currentBendaColoring) {
        const benda = bendaColoringData[currentBendaColoring];
        playSound(benda.name + ", " + benda.spelling, "id-ID");
      }
    });
  }

  // Canvas events
  bendaColoringCanvas.addEventListener("mousedown", startDrawingBenda);
  bendaColoringCanvas.addEventListener("mousemove", drawBenda);
  bendaColoringCanvas.addEventListener("mouseup", stopDrawingBenda);
  bendaColoringCanvas.addEventListener("mouseout", stopDrawingBenda);

  // Touch support
  bendaColoringCanvas.addEventListener("touchstart", handleTouchStart);
  bendaColoringCanvas.addEventListener("touchmove", handleTouchMove);
  bendaColoringCanvas.addEventListener("touchend", stopDrawingBenda);

  // Set first color as active
  document.querySelector(".color-btn-benda").classList.add("active");
}

function startBendaColoring(bendaKey) {
  if (!bendaColoringData[bendaKey]) return;

  currentBendaColoring = bendaKey;
  const benda = bendaColoringData[bendaKey];
  coloringPercentage = 0; // Reset coloring percentage

  // Hide selection, show game
  document
    .getElementById("coloringBendaSelectionScreen")
    .classList.remove("active");
  document.getElementById("coloringBendaGameScreen").classList.add("active");

  // Update title
  document.getElementById("bendaColoringName").textContent = benda.name;

  // Clear canvas and draw benda
  bendaColoringCtx.fillStyle = "white";
  bendaColoringCtx.fillRect(
    0,
    0,
    bendaColoringCanvas.width,
    bendaColoringCanvas.height,
  );

  // Draw benda outline dengan styling lebih bagus
  bendaColoringCtx.strokeStyle = "#333333";
  bendaColoringCtx.lineWidth = 4;
  bendaColoringCtx.lineCap = "round";
  bendaColoringCtx.lineJoin = "round";

  benda.drawFunction(bendaColoringCtx);

  // Save outline image data untuk reference
  outlineImageData = bendaColoringCtx.getImageData(
    0,
    0,
    bendaColoringCanvas.width,
    bendaColoringCanvas.height,
  );

  // Update progress indicator
  updateColoringProgressUI();
}

function startDrawingBenda(e) {
  if (!currentBendaColoring) return;

  isDrawingBendaColoring = true;
  const rect = bendaColoringCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (bendaColoringCanvas.width / rect.width);
  const y = (e.clientY - rect.top) * (bendaColoringCanvas.height / rect.height);

  bendaColoringCtx.beginPath();
  bendaColoringCtx.moveTo(x, y);
}

function handleTouchStart(e) {
  e.preventDefault();
  if (!currentBendaColoring) return;

  isDrawingBendaColoring = true;
  const touch = e.touches[0];
  const rect = bendaColoringCanvas.getBoundingClientRect();
  const x =
    (touch.clientX - rect.left) * (bendaColoringCanvas.width / rect.width);
  const y =
    (touch.clientY - rect.top) * (bendaColoringCanvas.height / rect.height);

  bendaColoringCtx.beginPath();
  bendaColoringCtx.moveTo(x, y);
}

function drawBenda(e) {
  if (!isDrawingBendaColoring) return;

  const rect = bendaColoringCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (bendaColoringCanvas.width / rect.width);
  const y = (e.clientY - rect.top) * (bendaColoringCanvas.height / rect.height);

  bendaColoringCtx.lineTo(x, y);
  bendaColoringCtx.strokeStyle = currentColorBenda;
  bendaColoringCtx.lineWidth = brushSizeBenda;
  bendaColoringCtx.lineCap = "round";
  bendaColoringCtx.lineJoin = "round";
  bendaColoringCtx.stroke();
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!isDrawingBendaColoring) return;

  const touch = e.touches[0];
  const rect = bendaColoringCanvas.getBoundingClientRect();
  const x =
    (touch.clientX - rect.left) * (bendaColoringCanvas.width / rect.width);
  const y =
    (touch.clientY - rect.top) * (bendaColoringCanvas.height / rect.height);

  bendaColoringCtx.lineTo(x, y);
  bendaColoringCtx.strokeStyle = currentColorBenda;
  bendaColoringCtx.lineWidth = brushSizeBenda;
  bendaColoringCtx.lineCap = "round";
  bendaColoringCtx.lineJoin = "round";
  bendaColoringCtx.stroke();
}

function stopDrawingBenda() {
  isDrawingBendaColoring = false;
  bendaColoringCtx.closePath();

  // Hitung persentase coloring setelah setiap stroke
  calculateColoringPercentage();
}

function calculateColoringPercentage() {
  const imageData = bendaColoringCtx.getImageData(
    0,
    0,
    bendaColoringCanvas.width,
    bendaColoringCanvas.height,
  );
  const data = imageData.data;

  let coloredPixels = 0;
  const totalPixels = data.length / 4;

  // Hitung pixel yang bukan putih (sudah diwarnai)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Jika bukan putih dan punya opacity, dianggap sudah diwarnai
    if ((r !== 255 || g !== 255 || b !== 255) && a > 200) {
      coloredPixels++;
    }
  }

  coloringPercentage = Math.round((coloredPixels / totalPixels) * 100);
  updateColoringProgressUI();
}

function clearBendaColoring() {
  bendaColoringCtx.fillStyle = "white";
  bendaColoringCtx.fillRect(
    0,
    0,
    bendaColoringCanvas.width,
    bendaColoringCanvas.height,
  );
  if (currentBendaColoring) {
    const benda = bendaColoringData[currentBendaColoring];
    benda.drawFunction(bendaColoringCtx);
  }
}

function backToColoringSelection() {
  document.getElementById("coloringBendaGameScreen").classList.remove("active");
  document
    .getElementById("coloringBendaSelectionScreen")
    .classList.add("active");
  currentBendaColoring = null;
}

function checkColoringCompletion() {
  // Hitung ulang untuk memastikan akurat
  calculateColoringPercentage();

  if (coloringPercentage < COLORING_THRESHOLD) {
    // Tampilkan pesan untuk coloring lebih banyak
    showIncompleteMessage();
    return;
  }

  // Cukup diwarnai, tampilkan modal
  showCompletionModal();
}

function showIncompleteMessage() {
  const message = `Gambar belum cukup diwarnai!\n\n${coloringPercentage}% / ${COLORING_THRESHOLD}%\n\nSilakan warnai lebih banyak area lagi! 🎨`;
  alert(message);
}

function updateColoringProgressUI() {
  // Update progress text dan bar
  const progressText = document.getElementById("coloringProgressText");
  const progressBar = document.getElementById("coloringProgressBar");

  if (progressText) {
    progressText.textContent = coloringPercentage + "%";
  }

  if (progressBar) {
    progressBar.style.width = coloringPercentage + "%";
  }

  // Tampilkan di console untuk debugging
  console.log(`Coloring Progress: ${coloringPercentage}%`);
}

function showCompletionModal() {
  if (!currentBendaColoring) return;

  const benda = bendaColoringData[currentBendaColoring];
  const icon = bendaIcons[currentBendaColoring];

  document.getElementById("modalBendaIcon").textContent = icon;
  document.getElementById("modalBendaName").textContent = benda.name;
  document.getElementById("modalSpellingDisplay").textContent = benda.spelling;

  document.getElementById("completionModal").classList.add("active");
}

function closeCompletionModal() {
  document.getElementById("completionModal").classList.remove("active");
}

function nextBenda() {
  closeCompletionModal();
  backToColoringSelection();
}

// ===== REALISTIC DRAWING FUNCTIONS =====

function drawChairRealistic(ctx) {
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Seat - lebih besar dan rounded
  ctx.beginPath();
  ctx.moveTo(centerX - 70, centerY - 30);
  ctx.lineTo(centerX + 70, centerY - 30);
  ctx.quadraticCurveTo(centerX + 75, centerY + 10, centerX + 70, centerY + 30);
  ctx.lineTo(centerX - 70, centerY + 30);
  ctx.quadraticCurveTo(centerX - 75, centerY + 10, centerX - 70, centerY - 30);
  ctx.stroke();

  // Backrest - dengan detail
  ctx.beginPath();
  ctx.moveTo(centerX - 55, centerY - 30);
  ctx.lineTo(centerX - 50, centerY - 90);
  ctx.lineTo(centerX - 30, centerY - 90);
  ctx.lineTo(centerX - 35, centerY - 30);
  ctx.stroke();

  // Backrest detail - vertical lines
  ctx.beginPath();
  ctx.moveTo(centerX - 50, centerY - 90);
  ctx.lineTo(centerX - 50, centerY - 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX - 40, centerY - 90);
  ctx.lineTo(centerX - 40, centerY - 35);
  ctx.stroke();

  // Front left leg
  ctx.beginPath();
  ctx.moveTo(centerX - 60, centerY + 30);
  ctx.lineTo(centerX - 60, centerY + 120);
  ctx.stroke();

  // Front right leg
  ctx.beginPath();
  ctx.moveTo(centerX + 60, centerY + 30);
  ctx.lineTo(centerX + 60, centerY + 120);
  ctx.stroke();

  // Back left leg
  ctx.beginPath();
  ctx.moveTo(centerX - 40, centerY - 30);
  ctx.lineTo(centerX - 40, centerY + 30);
  ctx.stroke();

  // Back right leg
  ctx.beginPath();
  ctx.moveTo(centerX - 10, centerY - 30);
  ctx.lineTo(centerX - 10, centerY + 30);
  ctx.stroke();
}

function drawTableRealistic(ctx) {
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Table top - dengan 3D effect
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 50, 110, 60, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Top edge detail
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 50, 105, 55, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Front left leg - tebal
  ctx.beginPath();
  ctx.rect(centerX - 90, centerY - 40, 20, 110);
  ctx.stroke();

  // Front right leg
  ctx.beginPath();
  ctx.rect(centerX + 70, centerY - 40, 20, 110);
  ctx.stroke();

  // Leg details - cross bracing
  ctx.beginPath();
  ctx.moveTo(centerX - 80, centerY + 30);
  ctx.lineTo(centerX + 80, centerY + 30);
  ctx.stroke();
}

function drawDoorRealistic(ctx) {
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Door frame - tebal
  ctx.beginPath();
  ctx.rect(centerX - 50, centerY - 110, 100, 160);
  ctx.stroke();

  // Door frame inner
  ctx.beginPath();
  ctx.rect(centerX - 45, centerY - 105, 90, 150);
  ctx.stroke();

  // Door panel - persegi panjang vertical
  ctx.beginPath();
  ctx.rect(centerX - 40, centerY - 100, 80, 140);
  ctx.stroke();

  // Door panel inner - raised panel effect
  ctx.beginPath();
  ctx.rect(centerX - 35, centerY - 95, 70, 130);
  ctx.stroke();

  // Door knob - dengan detail
  ctx.beginPath();
  ctx.arc(centerX + 30, centerY, 8, 0, Math.PI * 2);
  ctx.stroke();

  // Door knob detail - inner circle
  ctx.beginPath();
  ctx.arc(centerX + 30, centerY, 5, 0, Math.PI * 2);
  ctx.stroke();

  // Hinges - 3 buah
  for (let i = 0; i < 3; i++) {
    const y = centerY - 80 + i * 60;
    ctx.beginPath();
    ctx.arc(centerX - 48, y, 4, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawWindowRealistic(ctx) {
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Outer frame - tebal
  ctx.beginPath();
  ctx.rect(centerX - 70, centerY - 70, 140, 140);
  ctx.stroke();

  // Inner frame - muntins
  ctx.beginPath();
  ctx.rect(centerX - 60, centerY - 60, 120, 120);
  ctx.stroke();

  // Vertical dividers - 2 garis
  ctx.beginPath();
  ctx.moveTo(centerX - 20, centerY - 60);
  ctx.lineTo(centerX - 20, centerY + 60);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + 20, centerY - 60);
  ctx.lineTo(centerX + 20, centerY + 60);
  ctx.stroke();

  // Horizontal divider
  ctx.beginPath();
  ctx.moveTo(centerX - 60, centerY);
  ctx.lineTo(centerX + 60, centerY);
  ctx.stroke();

  // Window glass reflection - subtle lines
  ctx.beginPath();
  ctx.moveTo(centerX - 55, centerY - 55);
  ctx.lineTo(centerX - 25, centerY - 30);
  ctx.stroke();
}

function drawBookRealistic(ctx) {
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Book spine (3D side) - untuk depth
  ctx.beginPath();
  ctx.moveTo(centerX + 45, centerY - 65);
  ctx.lineTo(centerX + 55, centerY - 60);
  ctx.lineTo(centerX + 55, centerY + 70);
  ctx.lineTo(centerX + 45, centerY + 65);
  ctx.closePath();
  ctx.stroke();

  // Book cover front - besar dan prominent
  ctx.beginPath();
  ctx.rect(centerX - 45, centerY - 65, 90, 130);
  ctx.stroke();

  // Cover border - inner frame
  ctx.beginPath();
  ctx.rect(centerX - 40, centerY - 60, 80, 120);
  ctx.stroke();

  // Title area - rounded rectangle
  ctx.beginPath();
  ctx.moveTo(centerX - 30, centerY - 45);
  ctx.lineTo(centerX + 20, centerY - 45);
  ctx.quadraticCurveTo(centerX + 25, centerY - 40, centerX + 25, centerY - 35);
  ctx.lineTo(centerX + 25, centerY - 25);
  ctx.quadraticCurveTo(centerX + 25, centerY - 20, centerX + 20, centerY - 20);
  ctx.lineTo(centerX - 30, centerY - 20);
  ctx.quadraticCurveTo(centerX - 35, centerY - 20, centerX - 35, centerY - 25);
  ctx.lineTo(centerX - 35, centerY - 35);
  ctx.quadraticCurveTo(centerX - 35, centerY - 40, centerX - 30, centerY - 45);
  ctx.stroke();

  // Pages line 1
  ctx.beginPath();
  ctx.moveTo(centerX - 35, centerY - 10);
  ctx.lineTo(centerX + 20, centerY - 10);
  ctx.stroke();

  // Pages line 2
  ctx.beginPath();
  ctx.moveTo(centerX - 35, centerY + 5);
  ctx.lineTo(centerX + 20, centerY + 5);
  ctx.stroke();

  // Pages line 3
  ctx.beginPath();
  ctx.moveTo(centerX - 35, centerY + 20);
  ctx.lineTo(centerX + 20, centerY + 20);
  ctx.stroke();

  // Pages line 4
  ctx.beginPath();
  ctx.moveTo(centerX - 35, centerY + 35);
  ctx.lineTo(centerX + 20, centerY + 35);
  ctx.stroke();

  // Bookmark ribbon
  ctx.beginPath();
  ctx.moveTo(centerX + 15, centerY - 65);
  ctx.lineTo(centerX + 15, centerY + 70);
  ctx.stroke();
}

function drawPencilRealistic(ctx) {
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Eraser (pink) - di sebelah kiri
  ctx.beginPath();
  ctx.rect(centerX - 80, centerY - 15, 20, 30);
  ctx.stroke();

  // Pencil body - hexagon effect
  ctx.beginPath();
  ctx.moveTo(centerX - 60, centerY - 20);
  ctx.lineTo(centerX + 50, centerY - 20);
  ctx.lineTo(centerX + 60, centerY);
  ctx.lineTo(centerX + 50, centerY + 20);
  ctx.lineTo(centerX - 60, centerY + 20);
  ctx.lineTo(centerX - 70, centerY);
  ctx.closePath();
  ctx.stroke();

  // Center line pada body
  ctx.beginPath();
  ctx.moveTo(centerX - 60, centerY);
  ctx.lineTo(centerX + 50, centerY);
  ctx.stroke();

  // Pencil tip - pointed triangle
  ctx.beginPath();
  ctx.moveTo(centerX + 50, centerY - 20);
  ctx.lineTo(centerX + 80, centerY);
  ctx.lineTo(centerX + 50, centerY + 20);
  ctx.closePath();
  ctx.stroke();

  // Wood inside the tip - detail
  ctx.beginPath();
  ctx.moveTo(centerX + 80, centerY);
  ctx.lineTo(centerX + 60, centerY - 5);
  ctx.lineTo(centerX + 60, centerY + 5);
  ctx.closePath();
  ctx.stroke();

  // Metal ferrule
  ctx.beginPath();
  ctx.rect(centerX - 65, centerY - 10, 8, 20);
  ctx.stroke();
}

function drawFlowerRealistic(ctx) {
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Stem - curved
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + 50);
  ctx.quadraticCurveTo(centerX - 15, centerY + 90, centerX - 10, centerY + 130);
  ctx.stroke();

  // Left leaf
  ctx.beginPath();
  ctx.moveTo(centerX - 5, centerY + 80);
  ctx.quadraticCurveTo(centerX - 45, centerY + 75, centerX - 50, centerY + 95);
  ctx.quadraticCurveTo(centerX - 45, centerY + 80, centerX - 5, centerY + 80);
  ctx.stroke();

  // Right leaf
  ctx.beginPath();
  ctx.moveTo(centerX + 5, centerY + 100);
  ctx.quadraticCurveTo(centerX + 45, centerY + 95, centerX + 50, centerY + 115);
  ctx.quadraticCurveTo(centerX + 45, centerY + 100, centerX + 5, centerY + 100);
  ctx.stroke();

  // Petals - 5 petal dengan detail
  const petalCount = 5;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * Math.PI * 2) / petalCount - Math.PI / 2;
    const petalX = centerX + Math.cos(angle) * 50;
    const petalY = centerY - 50 + Math.sin(angle) * 50;

    // Outer petal shape
    ctx.beginPath();
    ctx.ellipse(petalX, petalY, 25, 35, angle, 0, Math.PI * 2);
    ctx.stroke();

    // Petal vein - detail
    ctx.beginPath();
    ctx.moveTo(petalX - Math.sin(angle) * 10, petalY - Math.cos(angle) * 10);
    ctx.lineTo(petalX + Math.sin(angle) * 20, petalY + Math.cos(angle) * 20);
    ctx.stroke();
  }

  // Flower center - besar
  ctx.beginPath();
  ctx.arc(centerX, centerY - 50, 20, 0, Math.PI * 2);
  ctx.stroke();

  // Center detail - inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY - 50, 12, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBallRealistic(ctx) {
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;
  const radius = 70;

  // Main circle - besar
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Horizontal line - untuk 3D effect
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Vertical line - center
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius);
  ctx.lineTo(centerX, centerY + radius);
  ctx.stroke();

  // Curved lines untuk panel effect
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.6, Math.PI, Math.PI * 2);
  ctx.stroke();

  // Side curved line - lebih detail
  ctx.beginPath();
  ctx.moveTo(centerX + radius * 0.7, centerY - radius * 0.5);
  ctx.quadraticCurveTo(
    centerX + radius * 0.8,
    centerY,
    centerX + radius * 0.7,
    centerY + radius * 0.5,
  );
  ctx.stroke();
}

console.log("Coloring Benda.js loaded!");
