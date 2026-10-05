const alphabetLetters = "abcdefghijklmnopqrstuvwxyz".split("");

document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("alphabetSortTiles");
  const status = document.getElementById("alphabetSortStatus");
  const checkButton = document.getElementById("checkAlphabetOrder");
  const shuffleButton = document.getElementById("shuffleAlphabet");
  const caseButton = document.getElementById("toggleAlphabetCase");
  const caseButtonText = document.getElementById("toggleAlphabetCaseText");

  if (
    !board ||
    !status ||
    !checkButton ||
    !shuffleButton ||
    !caseButton ||
    !caseButtonText
  ) {
    throw new Error("Elemen permainan Menyusun Huruf A-Z tidak ditemukan.");
  }

  let draggedTile = null;
  let activePointerId = null;
  let isUppercase = true;

  function updateLetterCase() {
    board.querySelectorAll(".alphabet-sort-tile").forEach((tile) => {
      const letter = tile.dataset.letter;
      const displayedLetter = isUppercase ? letter.toUpperCase() : letter;
      tile.textContent = displayedLetter;
      tile.setAttribute(
        "aria-label",
        `Huruf ${displayedLetter}, dapat dipindahkan`,
      );
    });

    caseButtonText.textContent = isUppercase ? "Huruf Besar" : "Huruf Kecil";
    caseButton.setAttribute("aria-pressed", String(isUppercase));
  }

  function shuffleLetters() {
    const shuffled = [...alphabetLetters];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[index],
      ];
    }

    if (shuffled.every((letter, index) => letter === alphabetLetters[index])) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }

    return shuffled;
  }

  function renderLetters() {
    board.replaceChildren();
    board.classList.remove("is-complete");

    shuffleLetters().forEach((letter) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "alphabet-sort-tile";
      tile.dataset.letter = letter;
      tile.title = "Seret untuk memindahkan huruf";
      board.appendChild(tile);
    });

    updateLetterCase();
    status.textContent = "Huruf sudah diacak. Seret untuk menyusunnya dari A sampai Z.";
  }

  function updatePositions() {
    board.querySelectorAll(".alphabet-sort-tile").forEach((tile, index) => {
      const letter = isUppercase
        ? tile.dataset.letter.toUpperCase()
        : tile.dataset.letter;
      tile.setAttribute(
        "aria-label",
        `Huruf ${letter}, posisi ${index + 1} dari 26`,
      );
    });
  }

  function finishDrag() {
    if (!draggedTile) return;

    draggedTile.classList.remove("is-dragging");
    draggedTile = null;
    activePointerId = null;
    board.classList.remove("is-dragging");
    updatePositions();
  }

  board.addEventListener("pointerdown", (event) => {
    const tile = event.target.closest(".alphabet-sort-tile");
    if (!tile || (event.pointerType === "mouse" && event.button !== 0)) return;

    draggedTile = tile;
    activePointerId = event.pointerId;
    draggedTile.classList.add("is-dragging");
    board.classList.add("is-dragging");
    event.preventDefault();
  });

  document.addEventListener(
    "pointermove",
    (event) => {
      if (!draggedTile || event.pointerId !== activePointerId) return;

      event.preventDefault();
      draggedTile.style.pointerEvents = "none";
      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest(".alphabet-sort-tile");
      draggedTile.style.pointerEvents = "";

      if (!target || target === draggedTile || target.parentElement !== board) {
        return;
      }

      const bounds = target.getBoundingClientRect();
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);
      const insertAfter =
        Math.abs(offsetX) > Math.abs(offsetY)
          ? offsetX > 0
          : offsetY > 0;

      if (insertAfter) {
        target.after(draggedTile);
      } else {
        target.before(draggedTile);
      }
    },
    { passive: false },
  );

  document.addEventListener("pointerup", finishDrag);
  document.addEventListener("pointercancel", finishDrag);

  board.addEventListener("keydown", (event) => {
    const tile = event.target.closest(".alphabet-sort-tile");
    if (!tile) return;

    const currentIndex = Array.from(board.children).indexOf(tile);
    const moveForward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const moveBackward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!moveForward && !moveBackward) return;

    event.preventDefault();
    const nextIndex = currentIndex + (moveForward ? 1 : -1);
    const target = board.children[nextIndex];
    if (!target) return;

    if (moveForward) {
      target.after(tile);
    } else {
      target.before(tile);
    }
    updatePositions();
    tile.focus();
  });

  checkButton.addEventListener("click", () => {
    const isCorrect = Array.from(board.children).every(
      (tile, index) => tile.dataset.letter === alphabetLetters[index],
    );

    board.classList.toggle("is-complete", isCorrect);
    status.textContent = isCorrect
      ? "Hebat! Urutan huruf A sampai Z sudah benar!"
      : "Belum tepat. Coba pindahkan huruf sampai urut dari A sampai Z.";
  });

  shuffleButton.addEventListener("click", renderLetters);
  caseButton.addEventListener("click", () => {
    isUppercase = !isUppercase;
    updateLetterCase();
  });

  renderLetters();
});
