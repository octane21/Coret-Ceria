// ========================================
// DRAWING BENDA - MAIN APPLICATION
// ========================================

const bendaData = {
  apel: {
    name: "Apel",
    icon: "../images/apel.png",
    referenceImage: "../images/apel.png",
    ejaan: "A-P-E-L",
    audioFile: "apel.mp3",
  },
  bola: {
    name: "Bola",
    icon: "../images/bola.png",
    referenceImage: "../images/bola.png",
    ejaan: "B-O-L-A",
    audioFile: "bola.mp3",
  },
  celana: {
    name: "Celana",
    icon: "../images/celana.png",
    referenceImage: "../images/celana.png",
    ejaan: "C-E-L-A-N-A",
    audioFile: "celana.mp3",
  },
  dompet: {
    name: "Dompet",
    icon: "../images/dompet.png",
    referenceImage: "../images/dompet.png",
    ejaan: "D-O-M-P-E-T",
    audioFile: "dompet.mp3",
  },
  ember: {
    name: "Ember",
    icon: "../images/ember.png",
    referenceImage: "../images/ember.png",
    ejaan: "E-M-B-E-R",
    audioFile: "ember.mp3",
  },
  foto: {
    name: "Foto",
    icon: "../images/foto.png",
    referenceImage: "../images/foto.png",
    ejaan: "F-O-T-O",
    audioFile: "foto.mp3",
  },
  gunting: {
    name: "Gunting",
    icon: "../images/gunting.png",
    referenceImage: "../images/gunting.png",
    ejaan: "G-U-N-T-I-N-G",
    audioFile: "gunting.mp3",
  },
  handuk: {
    name: "Handuk",
    icon: "../images/handuk.png",
    referenceImage: "../images/handuk.png",
    ejaan: "H-A-N-D-U-K",
    audioFile: "handuk.mp3",
  },
  ikan: {
    name: "Ikan",
    icon: "../images/ikan.png",
    referenceImage: "../images/ikan.png",
    ejaan: "I-K-A-N",
    audioFile: "ikan.mp3",
  },
  jam: {
    name: "Jam",
    icon: "../images/jam.png",
    referenceImage: "../images/jam.png",
    ejaan: "J-A-M",
    audioFile: "jam.mp3",
  },
  kunci: {
    name: "Kunci",
    icon: "../images/kunci.png",
    referenceImage: "../images/kunci.png",
    ejaan: "K-U-N-C-I",
    audioFile: "kunci.mp3",
  },
  lampu: {
    name: "Lampu",
    icon: "../images/lampu.png",
    referenceImage: "../images/lampu.png",
    ejaan: "L-A-M-P-U",
    audioFile: "lampu.mp3",
  },
  mobil: {
    name: "Mobil",
    icon: "../images/mobil.png",
    referenceImage: "../images/mobil.png",
    ejaan: "M-O-B-I-L",
    audioFile: "mobil.mp3",
  },
  nanas: {
    name: "Nanas",
    icon: "../images/nanas.png",
    referenceImage: "../images/nanas.png",
    ejaan: "N-A-N-A-S",
    audioFile: "nanas.mp3",
  },
  obat: {
    name: "Obat",
    icon: "../images/obat.png",
    referenceImage: "../images/obat.png",
    ejaan: "O-B-A-T",
    audioFile: "obat.mp3",
  },
  pisang: {
    name: "Pisang",
    icon: "../images/pisang.png",
    referenceImage: "../images/pisang.png",
    ejaan: "P-I-S-A-N-G",
    audioFile: "pisang.mp3",
  },
  kertas: {
    name: "Kertas",
    icon: "../images/placeholder.png",
    referenceImage: "../images/placeholder.png",
    ejaan: "K-E-R-T-A-S",
    audioFile: "kertas.mp3",
  },
  rumah: {
    name: "Rumah",
    icon: "../images/rumah.png",
    referenceImage: "../images/rumah.png",
    ejaan: "R-U-M-A-H",
    audioFile: "rumah.mp3",
  },
  sepatu: {
    name: "Sepatu",
    icon: "../images/sepatu.png",
    referenceImage: "../images/sepatu.png",
    ejaan: "S-E-P-A-T-U",
    audioFile: "sepatu.mp3",
  },
  topi: {
    name: "Topi",
    icon: "../images/topi.png",
    referenceImage: "../images/topi.png",
    ejaan: "T-O-P-I",
    audioFile: "topi.mp3",
  },
  udang: {
    name: "Udang",
    icon: "../images/udang.png",
    referenceImage: "../images/udang.png",
    ejaan: "U-D-A-N-G",
    audioFile: "udang.mp3",
  },
  vas_bunga: {
    name: "Vas Bunga",
    icon: "../images/vas.png",
    referenceImage: "../images/vas.png",
    ejaan: "V-A-S-B-U-N-G-A",
    audioFile: "vas_bunga.mp3",
  },
  wajan: {
    name: "Wajan",
    icon: "../images/wajan.png",
    referenceImage: "../images/wajan.png",
    ejaan: "W-A-J-A-N",
    audioFile: "wajan.mp3",
  },
  xray: {
    name: "X-ray",
    icon: "../images/xray.png",
    referenceImage: "../images/xray.png",
    ejaan: "X-R-A-Y",
    audioFile: "xray.mp3",
  },
  yoyo: {
    name: "Yoyo",
    icon: "../images/yoyo.png",
    referenceImage: "../images/yoyo.png",
    ejaan: "Y-O-Y-O",
    audioFile: "yoyo.mp3",
  },
  zebra: {
    name: "Zebra",
    icon: "../images/zebra.png",
    referenceImage: "../images/zebra.png",
    ejaan: "Z-E-B-R-A",
    audioFile: "zebra.mp3",
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

  // Use audioFile from bendaData to build path
  const audioPath = `../sounds/${bendaInfo.audioFile}`;
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
