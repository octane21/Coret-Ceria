// ===== PENYUSUNAN HURUF =====

// Data benda dengan huruf - 26 benda A-Z (sama seperti di benda.js)
const susunData = {
  apel: {
    name: "Apel",
    icon: "🍎",
    word: "apel",
    letters: ["a", "p", "e", "l"],
  },
  bola: {
    name: "Bola",
    icon: "⚽",
    word: "bola",
    letters: ["b", "o", "l", "a"],
  },
  celana: {
    name: "Celana",
    icon: "👖",
    word: "celana",
    letters: ["c", "e", "l", "a", "n", "a"],
  },
  dompet: {
    name: "Dompet",
    icon: "👝",
    word: "dompet",
    letters: ["d", "o", "m", "p", "e", "t"],
  },
  ember: {
    name: "Ember",
    icon: "🪣",
    word: "ember",
    letters: ["e", "m", "b", "e","r"],
  },
  foto: {
    name: "Foto",
    icon: "🖼️",
    word: "foto",
    letters: ["f", "o", "t", "o"],
  },
  gunting: {
    name: "Gunting",
    icon: "✂️",
    word: "gunting",
    letters: ["g", "u", "n", "t", "i","n","g"],
  },
  handuk: {
    name: "Handuk",
    icon: "🧣",
    word: "handuk",
    letters: ["h", "a", "n", "d","u","k"],
  },
  ikan: {
    name: "Ikan",
    icon: "🐟",
    word: "ikan",
    letters: ["i", "k", "a", "n"],
  },
  jam: {
    name: "Jam",
    icon: "⏰",
    word: "jam",
    letters: ["j", "a", "m"],
  },
  kunci: {
    name: "Kunci",
    icon: "🔑",
    word: "kunci",
    letters: ["k", "u", "n", "c", "i"],
  },
  lampu: {
    name: "Lampu",
    icon: "💡",
    word: "lampu",
    letters: ["l", "a", "m", "p", "u"],
  },
  mobil: {
    name: "Mobil",
    icon: "🚗",
    word: "mobil",
    letters: ["m", "o", "b", "i", "l"],
  },
  nanas: {
    name: "Nanas",
    icon: "🍍",
    word: "nanas",
    letters: ["n", "a", "n", "a", "s"],
  },
  obat: {
    name: "Obat",
    icon: "💊",
    word: "obat",
    letters: ["o", "b", "a", "t"],
  },
  pisang: {
    name: "Pisang",
    icon: "🍌",
    word: "pisang",
    letters: ["p", "i", "s", "a", "n", "g"],
  },
  quiz: {
    name: "Quiz",
    icon: "📝",
    word: "quiz",
    letters: ["q", "u", "i", "z"],
  },
  rumah: {
    name: "Rumah",
    icon: "🏠",
    word: "rumah",
    letters: ["r", "u", "m", "a", "h"],
  },
  sepatu: {
    name: "Sepatu",
    icon: "👞",
    word: "sepatu",
    letters: ["s", "e", "p", "a", "t", "u"],
  },
  topi: {
    name: "Topi",
    icon: "🎩",
    word: "topi",
    letters: ["t", "o", "p", "i"],
  },
  udang: {
    name: "Udang",
    icon: "🦐",
    word: "udang",
    letters: ["u", "d", "a", "n", "g"],
  },
  vas_bunga: {
    name: "Vas bunga",
    icon: "🪴",
    word: "vas bunga",
    letters: ["v", "a", "s"," ", "b","u","n","g","a"],
  },
  wajan: {
    name: "Wajan",
    icon: "🍳",
    word: "wajan",
    letters: ["w", "a", "j", "a", "n"],
  },
  xray: {
    name: "X-ray",
    icon: "🩻",
    word: "x-ray",
    letters: ["x", "-", "r", "a", "y"],
  },
  yoyo: {
    name: "Yoyo",
    icon: "🥛",
    word: "yoyo",
    letters: ["y", "o", "y","o"],
  },
  zebra: {
    name: "Zebra",
    icon: "🦓",
    word: "zebra",
    letters: ["z", "e", "b", "r", "a"],
  },
};

let currentSusun = null;
let selectedLetters = [];

document.addEventListener("DOMContentLoaded", () => {
  initSusun();

  // Check if there's a susun parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const susunKey = urlParams.get("susun");
  if (susunKey && susunData[susunKey]) {
    selectSusun(susunKey);
    console.log(susunKey);
  } else {
    // Default select "apel" saat pertama kali masuk
    selectSusun("apel");
  }
});

function initSusun() {
  // Event listener untuk setiap susun item
  const susunItems = document.querySelectorAll(".susun-btn");
  susunItems.forEach((item) => {
    item.addEventListener("click", () => {
      const susunKey = item.getAttribute("data-susun");
      selectSusun(susunKey);
    });
  });

  // Check button
  const btnCheck = document.getElementById("btnCheckSusun");
  if (btnCheck) {
    btnCheck.addEventListener("click", checkAnswer);
  }
}

function selectSusun(susunKey) {
  if (!susunData[susunKey]) return;

  currentSusun = susunKey;
  const susun = susunData[susunKey];
  selectedLetters = [];

  // Update board display at the top
  document.getElementById("susunIconLarge").textContent = susun.icon;
  // document.getElementById("susunWordDisplay").textContent = susun.name;

  // Generate shuffled letters
  const shuffledLetters = shuffleArray([...susun.letters]);
  const lettersPool = document.getElementById("lettersPool");
  lettersPool.innerHTML = "";

  shuffledLetters.forEach((letter, index) => {
    const letterBtn = document.createElement("div");
    letterBtn.className = "susun-letter";
    letterBtn.textContent = letter;
    letterBtn.setAttribute("data-letter", letter);
    letterBtn.setAttribute("data-index", index);
    letterBtn.addEventListener("click", () =>
      addLetterToDropzone(letter, letterBtn),
    );
    lettersPool.appendChild(letterBtn);
  });

  // Create placeholder boxes di dropzone
  const dropzone = document.getElementById("lettersDropzone");
  dropzone.innerHTML = "";

  // Buat kotak placeholder untuk setiap huruf
  susun.letters.forEach((letter) => {
    const placeholder = document.createElement("div");
    placeholder.className = "susun-placeholder";
    placeholder.setAttribute("data-placeholder", "true");
    dropzone.appendChild(placeholder);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addLetterToDropzone(letter, btn) {
  selectedLetters.push(letter);
  btn.style.opacity = "0.5";
  btn.style.pointerEvents = "none";

  // Cari placeholder kosong pertama
  const dropzone = document.getElementById("lettersDropzone");
  const placeholders = dropzone.querySelectorAll(".susun-placeholder");
  const emptyPlaceholder = Array.from(placeholders).find(
    (p) => !p.classList.contains("filled"),
  );

  if (emptyPlaceholder) {
    // Isi placeholder dengan huruf
    emptyPlaceholder.textContent = letter;
    emptyPlaceholder.classList.add("filled");
    emptyPlaceholder.setAttribute("data-letter", letter);
    emptyPlaceholder.setAttribute(
      "data-source-btn",
      btn.getAttribute("data-index"),
    );

    // Tambah event listener untuk menghapus dari placeholder
    emptyPlaceholder.addEventListener("click", () =>
      removeLetterFromDropzone(letter, btn, emptyPlaceholder),
    );
  }
}

function removeLetterFromDropzone(letter, btn, placeholder) {
  const index = selectedLetters.indexOf(letter);
  if (index > -1) {
    selectedLetters.splice(index, 1);
  }
  btn.style.opacity = "1";
  btn.style.pointerEvents = "auto";

  // Clear placeholder
  placeholder.textContent = "";
  placeholder.classList.remove("filled");
  placeholder.removeAttribute("data-letter");
  placeholder.removeAttribute("data-source-btn");
}

function checkAnswer() {
  if (!currentSusun) return;

  const susun = susunData[currentSusun];
  const answer = selectedLetters.join("");

  if (answer === susun.word) {
    // Show success modal with hanging banner
    showResultModal(true, answer);
  } else {
    // Show error modal with hanging banner
    showResultModal(false, susun.word);
  }
}

function showResultModal(isCorrect, word) {
  const modal = document.getElementById("susunResultModal");
  const resultIcon = document.getElementById("resultIcon");
  const resultMessage = document.getElementById("resultMessage");
  const resultDetails = document.getElementById("resultDetails");
  const bannerBox = document.querySelector(".banner-box");

  if (isCorrect) {
    resultIcon.textContent = "✓";
    resultMessage.textContent = "Jawaban Benar!";
    resultDetails.textContent = `Kamu telah menyusun huruf menjadi: ${word}`;
    bannerBox.style.background =
      "linear-gradient(135deg, #51cf66 0%, #2f9e44 100%)";
    bannerBox.style.borderColor = "#2f9e44";
  } else {
    resultIcon.textContent = "✗";
    resultMessage.textContent = "Jawaban Salah";
    resultDetails.textContent = `Jawaban yang benar: ${word}`;
    bannerBox.style.background =
      "linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%)";
    bannerBox.style.borderColor = "#ff4444";
  }

  modal.classList.add("active");
}

function speakAnswerSusun() {
  if (!currentSusun) return;

  const susun = susunData[currentSusun];
  const answer = selectedLetters.join("");

  // Speak the word with character-by-character spelling
  if ("speechSynthesis" in window) {
    // First, speak the complete word
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = "id-ID";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // After word is spoken, speak character by character
    utterance.onend = () => {
      setTimeout(() => {
        const letters = answer.toUpperCase().split("");
        speakLettersSequentially(letters, 0);
      }, 500);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
}

function speakLettersSequentially(letters, index) {
  if (index >= letters.length) return;

  const letter = letters[index];
  const utterance = new SpeechSynthesisUtterance(letter);
  utterance.lang = "id-ID";
  utterance.rate = 0.8;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  utterance.onend = () => {
    setTimeout(() => {
      speakLettersSequentially(letters, index + 1);
    }, 300);
  };

  speechSynthesis.speak(utterance);
}

function nextWordSusun() {
  // Tetap pilih benda yang sama, tapi dengan huruf yang di-shuffle ulang
  if (currentSusun) {
    selectSusun(currentSusun);
  } else {
    // Jika tidak ada benda terpilih, default ke kursi
    selectSusun("kursi");
  }
  window.scrollTo({
    top: document.querySelector(".susun-main-board").offsetTop - 100,
    behavior: "smooth",
  });
}

function closeModalSusun() {
  nextWordSusun();
}

function closeResultModal() {
  const modal = document.getElementById("susunResultModal");
  modal.classList.remove("active");
  nextWordSusun();
}

function backToBermain() {
  window.location.href = "bermain.html";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

console.log("Susun.js loaded!");
