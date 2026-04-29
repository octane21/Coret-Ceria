// ===== DRAWING / CORET-CORET =====

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawColor = "#667eea";
let brushSize = 5;

document.addEventListener("DOMContentLoaded", () => {
  initDrawing();
});

function initDrawing() {
  const canvas = document.getElementById("drawingCanvas");
  if (!canvas) return;

  // Set canvas size
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  const ctx = canvas.getContext("2d");

  // Color picker
  const colorPicker = document.getElementById("colorPicker");
  if (colorPicker) {
    colorPicker.addEventListener("change", (e) => {
      drawColor = e.target.value;
    });
  }

  // Brush size
  const brushSize_input = document.getElementById("brushSize");
  if (brushSize_input) {
    brushSize_input.addEventListener("change", (e) => {
      brushSize = e.target.value;
    });
  }

  // Clear button
  const clearBtn = document.querySelector("#drawingScreen .btn-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  // Mouse events
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    draw(ctx, lastX, lastY, x, y);
    lastX = x;
    lastY = y;
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });

  // Touch events
  canvas.addEventListener("touchstart", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
  });

  canvas.addEventListener("touchmove", (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    draw(ctx, lastX, lastY, x, y);
    lastX = x;
    lastY = y;
    e.preventDefault();
  });

  canvas.addEventListener("touchend", () => {
    isDrawing = false;
  });
}

function draw(ctx, fromX, fromY, toX, toY) {
  ctx.strokeStyle = drawColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}

console.log("Drawing.js loaded!");
