// ===== SUSUN SUCCESS PAGE =====

// Data benda (shared dari susun.js)
const susunData = {
  kursi: {
    name: "Kursi",
    icon: "🪑",
    word: "kursi",
    letters: ["k", "u", "r", "s", "i"],
  },
  meja: {
    name: "Meja",
    icon: "🪑",
    word: "meja",
    letters: ["m", "e", "j", "a"],
  },
  pintu: {
    name: "Pintu",
    icon: "🚪",
    word: "pintu",
    letters: ["p", "i", "n", "t", "u"],
  },
  jendela: {
    name: "Jendela",
    icon: "🪟",
    word: "jendela",
    letters: ["j", "e", "n", "d", "e", "l", "a"],
  },
  buku: {
    name: "Buku",
    icon: "📚",
    word: "buku",
    letters: ["b", "u", "k", "u"],
  },
  pensil: {
    name: "Pensil",
    icon: "✏️",
    word: "pensil",
    letters: ["p", "e", "n", "s", "i", "l"],
  },
  bunga: {
    name: "Bunga",
    icon: "🌸",
    word: "bunga",
    letters: ["b", "u", "n", "g", "a"],
  },
  bola: {
    name: "Bola",
    icon: "⚽",
    word: "bola",
    letters: ["b", "o", "l", "a"],
  },
};

let currentSusun = null;
let successAnswer = null;

document.addEventListener("DOMContentLoaded", () => {
  initSuccessPage();
});

function initSuccessPage() {
  // Get data dari URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const susunKey = urlParams.get("susun");
  const answer = urlParams.get("answer");

  if (susunKey && susunData[susunKey]) {
    currentSusun = susunKey;
    successAnswer = answer;
    displaySuccessContent(susunKey, answer);
  } else {
    // Fallback jika tidak ada parameter, kembali ke halaman sebelumnya
    window.history.back();
  }

  // Setup button listeners
  setupSuccessButtons();
}

function displaySuccessContent(susunKey, answer) {
  const susun = susunData[susunKey];

  // Update icon
  document.getElementById("successIconSusun").textContent = susun.icon;

  // Update spelling display (A-B-C format)
  const spellingDisplay = document.getElementById("spellingDisplay");
  const spellingLetters = answer.toUpperCase().split("");
  spellingDisplay.innerHTML = spellingLetters
    .map((letter) => `<span class="spelling-letter">${letter}</span>`)
    .join("<span class='spelling-separator'> - </span>");

  // Update answer text
  document.getElementById("answerTextSusun").textContent = answer.toUpperCase();
}

function setupSuccessButtons() {
  const btnAudio = document.getElementById("btnAudioSusun");
  const btnNext = document.getElementById("btnNextSusun");
  const btnAgain = document.getElementById("btnAgainSusun");

  btnAudio.addEventListener("click", () => speakAnswerSusun());
  btnNext.addEventListener("click", () => nextWordSusun());
  btnAgain.addEventListener("click", () => closeModalSusun());
}

function speakAnswerSusun() {
  if (!currentSusun || !successAnswer) return;

  const utterance = new SpeechSynthesisUtterance(successAnswer);
  utterance.lang = "id-ID";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function nextWordSusun() {
  // Kembali ke halaman susun untuk memilih kata berikutnya
  window.location.href = "susun.html";
}

function closeModalSusun() {
  // Kembali ke halaman susun untuk menyusun ulang kata yang sama
  window.location.href = "susun.html?susun=" + currentSusun;
}
