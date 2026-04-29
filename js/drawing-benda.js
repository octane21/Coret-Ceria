// ========================================
// DRAWING BENDA - MAIN APPLICATION
// ========================================

const bendaData = {
  kursi: {
    name: "Kursi",
    icon: "../images/kursi.png",
    referenceImage: "../images/kursi.png",
    ejaan: "K-U-R-S-I",
  },
  meja: {
    name: "Meja",
    icon: "../images/meja.png",
    referenceImage: "../images/meja.png",
    ejaan: "M-E-J-A",
  },
  pintu: {
    name: "Pintu",
    icon: "../images/pintu.png",
    referenceImage: "../images/pintu.png",
    ejaan: "P-I-N-T-U",
  },
  jendela: {
    name: "Jendela",
    icon: "../images/jendela.png",
    referenceImage: "../images/jendela.png",
    ejaan: "J-E-N-D-E-L-A",
  },
  buku: {
    name: "Buku",
    icon: "../images/buku.png",
    referenceImage: "../images/buku.png",
    ejaan: "B-U-K-U",
  },
  pensil: {
    name: "Pensil",
    icon: "../images/pensil.png",
    referenceImage: "../images/pensil.png",
    ejaan: "P-E-N-S-I-L",
  },
  bunga: {
    name: "Bunga",
    icon: "../images/bunga.png",
    referenceImage: "../images/bunga.png",
    ejaan: "B-U-N-G-A",
  },
  bola: {
    name: "Bola",
    icon: "../images/bola.png",
    referenceImage: "../images/bola.png",
    ejaan: "B-O-L-A",
  },
};

let currentBenda = null;
let isDrawing = false;
let drawingCanvas = null;
let canvasContext = null;
let drawingHistory = [];
let currentColor = "#333333";
let currentBrushSize = 3;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Setup event listeners untuk selection screen
  document.querySelectorAll(".drawing-benda-item").forEach((item) => {
    item.addEventListener("click", function () {
      const bendaKey = this.dataset.benda;
      startDrawing(bendaKey);
    });
  });

  // Setup canvas
  drawingCanvas = document.getElementById("drawingCanvas");
  if (drawingCanvas) {
    canvasContext = drawingCanvas.getContext("2d");
    drawingCanvas.addEventListener("mousedown", startDrawingStroke);
    drawingCanvas.addEventListener("mousemove", continueDrawingStroke);
    drawingCanvas.addEventListener("mouseup", stopDrawingStroke);
    drawingCanvas.addEventListener("mouseout", stopDrawingStroke);

    // Touch events
    drawingCanvas.addEventListener("touchstart", handleTouchStart);
    drawingCanvas.addEventListener("touchmove", handleTouchMove);
    drawingCanvas.addEventListener("touchend", handleTouchEnd);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  // Setup color input
  const penColor = document.getElementById("penColor");
  if (penColor) {
    penColor.addEventListener("change", function () {
      currentColor = this.value;
    });
  }

  // Setup brush size
  const brushSize = document.getElementById("brushSize");
  if (brushSize) {
    brushSize.addEventListener("input", function () {
      currentBrushSize = parseInt(this.value);
      document.getElementById("brushSizeLabel").textContent =
        currentBrushSize + "px";
    });
  }
}

// ========================================
// SELECTION SCREEN
// ========================================

function startDrawing(bendaKey) {
  if (!bendaData[bendaKey]) return;

  currentBenda = bendaKey;
  const bendaInfo = bendaData[bendaKey];

  // Update game screen dengan informasi benda
  document.getElementById("drawingTitle").textContent =
    "Menggambar " + bendaInfo.name;

  // Tampilkan referensi gambar (PNG)
  const referenceBox = document.getElementById("referenceBox");
  referenceBox.innerHTML = `<img src="${bendaInfo.referenceImage}" alt="Referensi ${bendaInfo.name}" class="reference-image" />`;

  // Bersihkan canvas
  clearCanvas();
  drawingHistory = [];

  // Pindah ke game screen
  document
    .getElementById("drawingBendaSelectionScreen")
    .classList.remove("active");
  document.getElementById("drawingBendaGameScreen").classList.add("active");

  // Set canvas size
  resizeCanvas();
}

// ========================================
// CANVAS DRAWING
// ========================================

function resizeCanvas() {
  if (!drawingCanvas) return;

  const container = drawingCanvas.parentElement;
  const rect = container.getBoundingClientRect();

  drawingCanvas.width = rect.width - 40; // Padding
  drawingCanvas.height = Math.max(300, rect.height - 60);

  // Redraw dari history jika ada
  if (drawingHistory.length > 0) {
    redrawCanvas();
  } else {
    // Bersihkan canvas
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }
}

function startDrawingStroke(e) {
  isDrawing = true;
  const rect = drawingCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  drawingHistory.push({
    type: "start",
    x,
    y,
    color: currentColor,
    size: currentBrushSize,
  });
  canvasContext.beginPath();
  canvasContext.moveTo(x, y);
}

function continueDrawingStroke(e) {
  if (!isDrawing) return;

  const rect = drawingCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  drawingHistory.push({
    type: "line",
    x,
    y,
    color: currentColor,
    size: currentBrushSize,
  });

  canvasContext.strokeStyle = currentColor;
  canvasContext.lineWidth = currentBrushSize;
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";
  canvasContext.lineTo(x, y);
  canvasContext.stroke();
}

function stopDrawingStroke() {
  isDrawing = false;
  canvasContext.closePath();
}

// Touch events
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  drawingCanvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  drawingCanvas.dispatchEvent(mouseEvent);
}

function handleTouchEnd(e) {
  e.preventDefault();
  const mouseEvent = new MouseEvent("mouseup", {});
  drawingCanvas.dispatchEvent(mouseEvent);
}

// ========================================
// DRAWING TOOLS
// ========================================

function clearCanvas() {
  if (!canvasContext || !drawingCanvas) return;

  canvasContext.fillStyle = "white";
  canvasContext.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  drawingHistory = [];
}

function undoDrawing() {
  if (drawingHistory.length === 0) return;

  // Hapus satu aksi terakhir
  let steps = 0;
  while (drawingHistory.length > 0 && steps < 1) {
    const item = drawingHistory.pop();
    if (item.type === "start") steps++;
  }

  redrawCanvas();
}

function redrawCanvas() {
  if (!canvasContext || !drawingCanvas) return;

  canvasContext.fillStyle = "white";
  canvasContext.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);

  canvasContext.strokeStyle = "#333";
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";
  canvasContext.beginPath();

  for (let i = 0; i < drawingHistory.length; i++) {
    const item = drawingHistory[i];

    if (item.type === "start") {
      canvasContext.stroke();
      canvasContext.strokeStyle = item.color;
      canvasContext.lineWidth = item.size;
      canvasContext.beginPath();
      canvasContext.moveTo(item.x, item.y);
    } else if (item.type === "line") {
      canvasContext.lineTo(item.x, item.y);
      canvasContext.stroke();
    }
  }
}

// ========================================
// GAME FLOW
// ========================================

function speakBenda() {
  if (!currentBenda) return;

  const bendaInfo = bendaData[currentBenda];

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create utterance for benda name
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = bendaInfo.name;
  utterance.lang = "id-ID"; // Indonesian language
  utterance.rate = 0.8; // Slower speech rate for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Add visual feedback to button
  const speakBtn = document.getElementById("speakBendaBtn");
  if (speakBtn) {
    speakBtn.style.opacity = "0.7";
    speakBtn.style.transform = "scale(0.95)";

    utterance.onend = function () {
      speakBtn.style.opacity = "1";
      speakBtn.style.transform = "scale(1)";
    };
  }

  // Speak
  window.speechSynthesis.speak(utterance);
}

function finishDrawing() {
  if (!currentBenda) return;

  const bendaInfo = bendaData[currentBenda];

  // Tampilkan modal selesai
  const modal = document.getElementById("drawingCompletionModal");
  const resultPreview = document.getElementById("resultPreview");
  const completionText = document.getElementById("drawingCompletionText");

  // Populate modal dengan informasi benda
  document.getElementById("modalBendaName").textContent = bendaInfo.name;
  document.getElementById("modalEjaanDisplay").textContent = bendaInfo.ejaan;

  // Buat preview canvas
  const previewCanvas = document.createElement("canvas");
  previewCanvas.width = 300;
  previewCanvas.height = 300;
  const previewCtx = previewCanvas.getContext("2d");

  previewCtx.fillStyle = "white";
  previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

  // Scale drawing ke preview
  const scaleX = previewCanvas.width / drawingCanvas.width;
  const scaleY = previewCanvas.height / drawingCanvas.height;

  previewCtx.strokeStyle = "#333";
  previewCtx.lineCap = "round";
  previewCtx.lineJoin = "round";
  previewCtx.beginPath();

  for (let i = 0; i < drawingHistory.length; i++) {
    const item = drawingHistory[i];

    if (item.type === "start") {
      previewCtx.stroke();
      previewCtx.strokeStyle = item.color;
      previewCtx.lineWidth = item.size * scaleX;
      previewCtx.beginPath();
      previewCtx.moveTo(item.x * scaleX, item.y * scaleY);
    } else if (item.type === "line") {
      previewCtx.lineTo(item.x * scaleX, item.y * scaleY);
      previewCtx.stroke();
    }
  }

  resultPreview.innerHTML = "";
  resultPreview.appendChild(previewCanvas);
  completionText.textContent =
    "Kamu berhasil menggambar " + bendaInfo.name + " dengan luar biasa!";

  modal.classList.add("active");

  // Auto-play audio ejaan saat modal muncul
  setTimeout(() => {
    playBendaAudio();
  }, 600); // Delay agar animasi selesai dulu
}

function retryDrawing() {
  document.getElementById("drawingCompletionModal").classList.remove("active");
  clearCanvas();
  drawingHistory = [];
}

function nextDrawing() {
  document.getElementById("drawingCompletionModal").classList.remove("active");
  backToDrawingSelection();
}

function backToDrawingSelection() {
  document.getElementById("drawingBendaGameScreen").classList.remove("active");
  document
    .getElementById("drawingBendaSelectionScreen")
    .classList.add("active");
  clearCanvas();
  currentBenda = null;
}

// ========================================
// AUDIO - PLAY SPELLING
// ========================================

function playBendaAudio() {
  if (!currentBenda) return;

  const bendaInfo = bendaData[currentBenda];

  // Stop any playing audio first
  stopAllAudio();

  // Try to play MP3 file first
  const audioPath = `../audio/${currentBenda}.mp3`;
  currentAudio = new Audio(audioPath);

  currentAudio.onerror = function () {
    // Fallback: use Web Speech API for text-to-speech
    speakEjaan(bendaInfo.ejaan, bendaInfo.name);
  };

  currentAudio.oncanplay = function () {
    // Audio file exists, play it
    currentAudio.play().catch(() => {
      // If play fails, use text-to-speech
      speakEjaan(bendaInfo.ejaan, bendaInfo.name);
    });
  };

  // Timeout untuk fallback jika file tidak respond
  setTimeout(() => {
    if (currentAudio.paused && currentAudio.currentTime === 0) {
      // Audio belum diplay, gunakan fallback
      speakEjaan(bendaInfo.ejaan, bendaInfo.name);
    }
  }, 500);
}

function speakEjaan(ejaan, bendaName) {
  // Gunakan Web Speech API
  if ("speechSynthesis" in window) {
    // Stop any previous speech
    window.speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = ejaan.replace(/-/g, " "); // Replace dash with space untuk pronunciation
    utterance.lang = "id-ID"; // Indonesian
    utterance.rate = 0.8; // Slower pace untuk clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Speak
    window.speechSynthesis.speak(utterance);
  }
}

// ========================================
// NAVIGATION
// ========================================

function goHome() {
  window.location.href = "../activities/bermain.html";
}
