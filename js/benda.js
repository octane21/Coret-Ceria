// ===== PENGENALAN BENDA (PENGEJAAN) =====

// Data benda dengan ejaan suku kata (A-Z)
const bendaData = {
  apel: {
    name: "Apel",
    icon: "🍎",
    syllables: ["a", "pel"],
    fullWord: "apel",
    audioFile: "apel.mp3",
  },
  bola: {
    name: "Bola",
    icon: "⚽",
    syllables: ["b", "ola"],
    fullWord: "bola",
    audioFile: "bola.mp3",
  },
  celana: {
    name: "Celana",
    icon: "👖",
    syllables: ["c", "elana"],
    fullWord: "celana",
    audioFile: "celana.mp3",
  },
  dompet: {
    name: "Dompet",
    icon: "👝",
    syllables: ["d", "ompet"],
    fullWord: "dompet",
    audioFile: "dompet.mp3",
  },
  ember: {
    name: "Ember",
    icon: "🪣",
    syllables: ["e", "mber"],
    fullWord: "ember",
    audioFile: "ember.mp3",
  },
  foto: {
    name: "Foto",
    icon: "🖼️",
    syllables: ["F", "oto"],
    fullWord: "Foto",
    audioFile: "foto.mp3",
  },
  gunting: {
    name: "Gunting",
    icon: "✂️",
    syllables: ["g", "unting"],
    fullWord: "gunting",
    audioFile: "gunting.mp3",
  },
  handuk: {
    name: "Handuk",
    icon: "🧣",
    syllables: ["h", "anduk"],
    fullWord: "handuk",
    audioFile: "handuk.mp3",
  },
  ikan: {
    name: "Ikan",
    icon: "🐟",
    syllables: ["i", "kan"],
    fullWord: "ikan",
    audioFile: "ikan.mp3",
  },
  jam: {
    name: "Jam",
    icon: "⏰",
    syllables: ["j", "am"],
    fullWord: "jam",
    audioFile: "jam.mp3",
  },
  kunci: {
    name: "Kunci",
    icon: "🔑",
    syllables: ["k", "unci"],
    fullWord: "kunci",
    audioFile: "kunci.mp3",
  },
  lampu: {
    name: "Lampu",
    icon: "💡",
    syllables: ["l", "ampu"],
    fullWord: "lampu",
    audioFile: "lampu.mp3",
  },
  mobil: {
    name: "Mobil",
    icon: "🚗",
    syllables: ["m", "obil"],
    fullWord: "mobil",
    audioFile: "mobil.mp3",
  },
  nanas: {
    name: "Nanas",
    icon: "🍍",
    syllables: ["n", "anas"],
    fullWord: "nanas",
    audioFile: "nanas.mp3",
  },
  obat: {
    name: "Obat",
    icon: "💊",
    syllables: ["o", "bat"],
    fullWord: "obat",
    audioFile: "obat.mp3",
  },
  pisang: {
    name: "Pisang",
    icon: "🍌",
    syllables: ["p", "isang"],
    fullWord: "pisang",
    audioFile: "pisang.mp3",
  },
  quiz: {
    name: "Quiz",
    icon: "📝",
    syllables: ["q", "uiz"],
    fullWord: "quiz",
    audioFile: "quiz.mp3",
  },
  rumah: {
    name: "Rumah",
    icon: "🏠",
    syllables: ["r", "umah"],
    fullWord: "rumah",
    audioFile: "rumah.mp3",
  },
  sepatu: {
    name: "Sepatu",
    icon: "👞",
    syllables: ["s", "epatu"],
    fullWord: "sepatu",
    audioFile: "sepatu.mp3",
  },
  topi: {
    name: "Topi",
    icon: "🎩",
    syllables: ["t", "opi"],
    fullWord: "topi",
    audioFile: "topi.mp3",
  },
  udang: {
    name: "Udang",
    icon: "🦐",
    syllables: ["u", "dang"],
    fullWord: "udang",
    audioFile: "udang.mp3",
  },
  vas_bunga: {
    name: "Vas bunga",
    icon: "🪴",
    syllables: ["v", "as bunga"],
    fullWord: "vas bunga",
    audioFile: "vas_bunga.mp3",
  },
  wajan: {
    name: "Wajan",
    icon: "🍳",
    syllables: ["w", "ajan"],
    fullWord: "wajan",
    audioFile: "wajan.mp3",
  },
  xray: {
    name: "X-ray",
    icon: "🩻",
    syllables: ["x", "ray"],
    fullWord: "xray",
    audioFile: "xray.mp3",
  },
  yoyo: {
    name: "Yoyo",
    icon: "🪀",
    syllables: ["y", "oyo"],
    fullWord: "yoyo",
    audioFile: "yoyo.mp3",
  },
  zebra: {
    name: "Zebra",
    icon: "🦓",
    syllables: ["z", "ebra"],
    fullWord: "zebra",
    audioFile: "zebra.mp3",
  },
};

let currentBenda = null;

document.addEventListener("DOMContentLoaded", () => {
  initBenda();
});

function initBenda() {
  // Initialize with first benda (apel - A)
  currentBenda = "apel";
  const initialBenda = bendaData["apel"];
  displayBendaBoard(initialBenda);

  // Event listener untuk setiap benda button di grid
  const bendaBtns = document.querySelectorAll(".benda-btn");
  bendaBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const bendaKey = btn.getAttribute("data-benda");
      console.log(bendaKey)
      selectBenda(bendaKey);
    });
  });

  // Listen button on main board
  const btnListen = document.getElementById("btnListenBenda");
  if (btnListen) {
    btnListen.addEventListener("click", () => {
      if (currentBenda) {
        playBendaAudio(currentBenda);
      }
    });
  }

  // Listen button on spelling screen
  const btnListenSpelling = document.getElementById("btnListenSpelling");
  if (btnListenSpelling) {
    btnListenSpelling.addEventListener("click", () => {
      if (currentBenda) {
        playBendaAudio(currentBenda);
      }
    });
  }
}

function selectBenda(bendaKey) {
  if (!bendaData[bendaKey]) return;
  console.log(bendaKey)
  currentBenda = bendaKey;
  const benda = bendaData[bendaKey];

  // Update display board
  displayBendaBoard(benda);

  // Play audio file sesuai dengan benda
  playBendaAudio(bendaKey);
}

function displayBendaBoard(benda) {
  // Update icon
  const iconElement = document.getElementById("bendaIconLarge");
  if (iconElement) {
    iconElement.textContent = benda.icon;
  }

  // Update word display
  const wordElement = document.getElementById("bendaWordDisplay");
  if (wordElement) {
    wordElement.textContent = benda.name;
  }

  // Generate syllables
  const syllablesContainer = document.getElementById("bendaSyllablesContainer");
  if (syllablesContainer) {
    syllablesContainer.innerHTML = "";

    benda.syllables.forEach((syllable, index) => {
      const syllableElement = document.createElement("div");
      syllableElement.className = "benda-syllable";
      syllableElement.textContent = syllable;

      // Add separator after each syllable except the last one
      if (index < benda.syllables.length - 1) {
                // const separator = document.createElement("span");
        // separator.className = "syllable-separator";
        syllableElement.classList.add("first")
        // separator.textContent = "-";
        // syllableElement.appendChild(separator);

        const separator = document.createElement("span");
        separator.className = "syllable-separator";
        separator.textContent = "-";
        syllableElement.appendChild(separator);
      }

      syllablesContainer.appendChild(syllableElement);
    });
  }
}

function backToSelection() {
  document.getElementById("bendaSpellingScreen").classList.remove("active");
  document.getElementById("bendaScreen").classList.add("active");
  currentBenda = null;
}

function playBendaSound(word) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "id-ID";
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);

    // Visual feedback
    const btn = document.getElementById("btnListenSpelling");
    if (btn) {
      btn.style.transform = "scale(0.95)";
      setTimeout(() => {
        btn.style.transform = "scale(1)";
      }, 100);
    }
  }
}

/**
 * Putar audio file untuk benda tertentu
 * @param {string} bendaKey - Key benda dari bendaData
 */
function playBendaAudio(bendaKey) {
  if (!bendaData[bendaKey]) return;

  const benda = bendaData[bendaKey];
  const audioPath = `../sounds/${benda.audioFile}`;
  console.log(audioPath);
  // Cek apakah sound dimatikan
  if (!canPlaySound()) {
    console.log("Sound is muted");
    return;
  }

  // Create atau reuse audio element
  let audioElement = document.getElementById("bendaAudioPlayer");
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.id = "bendaAudioPlayer";
    document.body.appendChild(audioElement);
  }

  audioElement.src = audioPath;
  audioElement.play().catch((err) => {
    console.error("Error playing audio:", err);
  });

  // Visual feedback pada listen button
  const listenBtn = document.getElementById("btnListenBenda");
  if (listenBtn) {
    listenBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      listenBtn.style.transform = "scale(1)";
    }, 100);
  }
}

console.log("Benda.js loaded!");
