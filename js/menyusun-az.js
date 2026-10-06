const alphabetLetters = "abcdefghijklmnopqrstuvwxyz".split("");

document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("alphabetSortTiles");
  const answerBoard = document.getElementById("alphabetSortAnswer");
  const status = document.getElementById("alphabetSortStatus");
  const checkButton = document.getElementById("checkAlphabetOrder");
  const shuffleButton = document.getElementById("shuffleAlphabet");
  const caseButton = document.getElementById("toggleAlphabetCase");
  const caseButtonText = document.getElementById("toggleAlphabetCaseText");

  if (
    !board ||
    !answerBoard ||
    !status ||
    !checkButton ||
    !shuffleButton ||
    !caseButton ||
    !caseButtonText
  ) {
    throw new Error("Elemen permainan Menyusun Huruf A-Z tidak ditemukan.");
  }

  let isUppercase = true;

  function updateLetterCase() {
    document.querySelectorAll(".alphabet-sort-tile").forEach((tile) => {
      const letter = tile.dataset.letter;
      const displayedLetter = isUppercase ? letter.toUpperCase() : letter;
      tile.textContent = displayedLetter;
      tile.setAttribute(
        "aria-label",
        tile.parentElement.classList.contains("alphabet-sort-tiles")
          ? `Huruf ${displayedLetter}, klik untuk menambahkan`
          : `Huruf ${displayedLetter}`,
      );
    });

    updateAnswerPositions();
    caseButtonText.textContent = isUppercase ? "Huruf Besar" : "Huruf Kecil";
    caseButton.setAttribute("aria-pressed", String(isUppercase));
  }

  function updateAnswerPositions() {
    answerBoard.querySelectorAll(".alphabet-sort-tile").forEach((tile, index) => {
      const letter = isUppercase
        ? tile.dataset.letter.toUpperCase()
        : tile.dataset.letter;
      tile.setAttribute(
        "aria-label",
        `Huruf ${letter}, posisi ${index + 1} dari 26. Klik untuk mengembalikan.`,
      );
    });
  }

  function clearAnswerFeedback() {
    answerBoard
      .querySelectorAll(".alphabet-sort-tile.is-incorrect")
      .forEach((tile) => tile.classList.remove("is-incorrect"));
    answerBoard.classList.remove("is-complete");
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
    answerBoard.replaceChildren();
    answerBoard.classList.remove("is-complete");

    shuffleLetters().forEach((letter) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "alphabet-sort-tile";
      tile.dataset.letter = letter;
      tile.title = "Klik untuk menambahkan huruf ke papan susunan";
      board.appendChild(tile);
    });

    alphabetLetters.forEach(() => {
      const slot = document.createElement("div");
      slot.className = "alphabet-sort-slot";
      answerBoard.appendChild(slot);
    });

    updateLetterCase();
    status.textContent =
      "Klik balok huruf di papan atas untuk menyusunnya dari A sampai Z pada papan bawah.";
  }

  board.addEventListener("click", (event) => {
    const tile = event.target.closest(".alphabet-sort-tile");
    if (!tile || tile.parentElement !== board) return;

    const nextSlot = answerBoard.querySelector(".alphabet-sort-slot:empty");
    if (!nextSlot) return;

    clearAnswerFeedback();
    nextSlot.appendChild(tile);
    updateAnswerPositions();
    status.textContent = `Huruf ${
      isUppercase ? tile.dataset.letter.toUpperCase() : tile.dataset.letter
    } ditambahkan pada posisi ${
      answerBoard.querySelectorAll(".alphabet-sort-tile").length
    } dari 26.`;
  });

  answerBoard.addEventListener("click", (event) => {
    const tile = event.target.closest(".alphabet-sort-tile");
    if (!tile) return;

    tile.classList.remove("is-incorrect");
    board.appendChild(tile);
    const selectedTiles = Array.from(
      answerBoard.querySelectorAll(".alphabet-sort-tile"),
    );
    selectedTiles.forEach((selectedTile, index) => {
      answerBoard.children[index].appendChild(selectedTile);
    });
    clearAnswerFeedback();
    updateLetterCase();
    status.textContent = "Huruf dikembalikan. Lanjutkan menyusun dari A sampai Z.";
  });

  checkButton.addEventListener("click", () => {
    const selectedLetters = Array.from(
      answerBoard.querySelectorAll(".alphabet-sort-tile"),
    );
    selectedLetters.forEach((tile, index) => {
      tile.classList.toggle(
        "is-incorrect",
        tile.dataset.letter !== alphabetLetters[index],
      );
    });
    const isCorrect =
      selectedLetters.length === alphabetLetters.length &&
      selectedLetters.every(
        (tile, index) => tile.dataset.letter === alphabetLetters[index],
      );

    answerBoard.classList.toggle("is-complete", isCorrect);
    status.textContent = isCorrect
      ? "Hebat! Urutan huruf A sampai Z sudah benar!"
      : selectedLetters.length < alphabetLetters.length
        ? `Kamu baru menyusun ${selectedLetters.length} dari 26 huruf. Lengkapi dulu sampai Z.`
        : "Belum tepat. Coba susun ulang huruf pada papan bawah dari A sampai Z.";
  });

  shuffleButton.addEventListener("click", renderLetters);
  caseButton.addEventListener("click", () => {
    isUppercase = !isUppercase;
    updateLetterCase();
  });

  renderLetters();
});
