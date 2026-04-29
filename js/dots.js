// ===== DOTS - CONNECT THE DOTS =====

let dotsConnected = 0;
let dots = [];
let connections = [];

document.addEventListener("DOMContentLoaded", () => {
  initDots();
});

function initDots() {
  const canvas = document.getElementById("dotsCanvas");
  if (!canvas) return;

  // Set canvas size
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  const ctx = canvas.getContext("2d");

  // Create dots
  generateDots(10);
  drawDots(ctx);

  // Canvas click to connect
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < dots.length; i++) {
      const dist = Math.hypot(x - dots[i].x, y - dots[i].y);
      if (dist < 15) {
        connectDot(i, ctx);
        break;
      }
    }
  });

  // Clear button
  const clearBtn = document.querySelector("#dotsScreen .btn-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      connections = [];
      dotsConnected = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDots(ctx);
    });
  }
}

function generateDots(count) {
  dots = [];
  const canvas = document.getElementById("dotsCanvas");
  const padding = 50;

  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * (canvas.width - padding * 2) + padding,
      y: Math.random() * (canvas.height - padding * 2) + padding,
      connected: false,
    });
  }

  // Sort dots for sequential connection
  dots.sort((a, b) => a.x - b.x);
}

function drawDots(ctx) {
  // Draw connections
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 3;
  for (let i = 0; i < connections.length - 1; i++) {
    const start = dots[connections[i]];
    const end = dots[connections[i + 1]];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Draw dots
  dots.forEach((dot, index) => {
    ctx.fillStyle = connections.includes(index) ? "#667eea" : "#FFD700";
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw number
    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(index + 1, dot.x, dot.y);
  });
}

function connectDot(index, ctx) {
  if (
    connections.length === 0 ||
    index === connections[connections.length - 1] + 1
  ) {
    connections.push(index);
    dotsConnected++;
    drawDots(ctx);

    // Check if all dots connected
    if (connections.length === dots.length) {
      showReward();
    }
  }
}

console.log("Dots.js loaded!");
