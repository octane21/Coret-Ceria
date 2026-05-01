// ===== GAME - TIC TAC TOE =====

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});

function initGame() {
  // Game cells
  document.querySelectorAll(".game-cell").forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index));
  });

  // Reset button di game screen
  const resetBtn = document.querySelector("#gameScreen .btn-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetGame);
  }

  // Modal button listeners
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  if (btnPlayAgain) {
    btnPlayAgain.addEventListener("click", () => {
      closeGameResultModal();
      resetGame();
    });
  }

  const btnBackToBermain = document.getElementById("btnBackToBermain");
  if (btnBackToBermain) {
    btnBackToBermain.addEventListener("click", () => {
      window.location.href = "bermain.html";
    });
  }
}

function handleCellClick(index) {
  if (gameBoard[index] === "" && gameActive) {
    gameBoard[index] = currentPlayer;
    updateCell(index);
    checkWin();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function updateCell(index) {
  const cells = document.querySelectorAll(".game-cell");
  cells[index].textContent = gameBoard[index];
  cells[index].style.fontSize = "40px";
  cells[index].style.fontWeight = "bold";
  cells[index].style.color = gameBoard[index] === "X" ? "#FF6B6B" : "#339AF0";
}

function checkWin() {
  let winner = null;

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      gameBoard[a] !== "" &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      gameActive = false;
      winner = gameBoard[a];
      showGameResult(winner, "win");
      break;
    }
  }

  // Check untuk draw (jika tidak ada winner dan semua cell penuh)
  if (gameBoard.every((cell) => cell !== "") && gameActive) {
    gameActive = false;
    showGameResult(null, "draw");
  }
}

function showGameResult(winner, resultType) {
  const modal = document.getElementById("gameCompletionModal");
  const resultIcon = document.getElementById("resultIcon");
  const resultMessage = document.getElementById("resultMessage");
  const resultDetails = document.getElementById("resultDetails");

  if (resultType === "win") {
    // Someone won
    resultIcon.textContent = "🏆";
    resultMessage.textContent = `🎉 Pemain ${winner} Menang! 🎉`;
    // resultDetails.textContent = "Selamat! Anda berhasil mengalahkan lawan!";
  } else if (resultType === "draw") {
    // Draw
    resultIcon.textContent = "🤝";
    resultMessage.textContent = "Seri!";
    resultDetails.textContent = "Permainan berakhir dengan seri!";
  }

  // Tampilkan modal dengan delay kecil
  setTimeout(() => {
    if (modal) {
      modal.classList.add("active");
      console.log("Game result modal shown");
    }
  }, 500);
}

function closeGameResultModal() {
  const modal = document.getElementById("gameCompletionModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  document.querySelectorAll(".game-cell").forEach((cell) => {
    cell.textContent = "";
    cell.style.color = "";
  });

  // Close modal jika ada
  closeGameResultModal();
}

console.log("Game.js loaded!");
