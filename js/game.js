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

  // Reset button
  const resetBtn = document.querySelector("#gameScreen .btn-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetGame);
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
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      gameBoard[a] !== "" &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      gameActive = false;
      showReward();
      break;
    }
  }

  if (gameBoard.every((cell) => cell !== "") && gameActive) {
    gameActive = false;
    console.log("Draw!");
  }
}

function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  document.querySelectorAll(".game-cell").forEach((cell) => {
    cell.textContent = "";
  });
}

console.log("Game.js loaded!");
