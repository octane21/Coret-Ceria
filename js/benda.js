// ===== PENGENALAN BENDA (PENGEJAAN) =====

// Data benda dengan ejaan suku kata (A-Z)
const bendaData = {
  apel: {
    name: "Apel",
    icon: "🍎",
    syllables: ["a", "pel"],
    fullWord: "apel",
  },
  bola: {
    name: "Bola",
    icon: "⚽",
    syllables: ["bo", "la"],
    fullWord: "bola",
  },
  cangkir: {
    name: "Cangkir",
    icon: "☕",
    syllables: ["cang", "kir"],
    fullWord: "cangkir",
  },
  dompet: {
    name: "Dompet",
    icon: "👝",
    syllables: ["dom", "pet"],
    fullWord: "dompet",
  },
  ekor: {
    name: "Ekor",
    icon: "🐿️",
    syllables: ["e", "kor"],
    fullWord: "ekor",
  },
  film: {
    name: "Film",
    icon: "🎬",
    syllables: ["film"],
    fullWord: "film",
  },
  gitar: {
    name: "Gitar",
    icon: "🎸",
    syllables: ["gi", "tar"],
    fullWord: "gitar",
  },
  hati: {
    name: "Hati",
    icon: "❤️",
    syllables: ["ha", "ti"],
    fullWord: "hati",
  },
  ikan: {
    name: "Ikan",
    icon: "�",
    syllables: ["i", "kan"],
    fullWord: "ikan",
  },
  jam: {
    name: "Jam",
    icon: "⏰",
    syllables: ["jam"],
    fullWord: "jam",
  },
  kunci: {
    name: "Kunci",
    icon: "🔑",
    syllables: ["kun", "ci"],
    fullWord: "kunci",
  },
  lilin: {
    name: "Lilin",
    icon: "🕯️",
    syllables: ["li", "lin"],
    fullWord: "lilin",
  },
  mobil: {
    name: "Mobil",
    icon: "🚗",
    syllables: ["mo", "bil"],
    fullWord: "mobil",
  },
  nanas: {
    name: "Nanas",
    icon: "🍍",
    syllables: ["na", "nas"],
    fullWord: "nanas",
  },
  orang: {
    name: "Obeng",
    icon: "🪛",
    syllables: ["o", "beng"],
    fullWord: "obeng",
  },
  pisang: {
    name: "Pisang",
    icon: "🍌",
    syllables: ["pi", "sang"],
    fullWord: "pisang",
  },
  qamis: {
    name: "Kayu",
    icon: "🪵",
    syllables: ["ka", "yu"],
    fullWord: "kayu",
  },
  rumah: {
    name: "Rumah",
    icon: "🏠",
    syllables: ["ru", "mah"],
    fullWord: "rumah",
  },
  sepatu: {
    name: "Sepatu",
    icon: "👞",
    syllables: ["se", "pa", "tu"],
    fullWord: "sepatu",
  },
  topi: {
    name: "Topi",
    icon: "🎩",
    syllables: ["to", "pi"],
    fullWord: "topi",
  },
  udang: {
    name: "Udang",
    icon: "🦐",
    syllables: ["u", "dang"],
    fullWord: "udang",
  },
  voli: {
    name: "Voli",
    icon: "🏐",
    syllables: ["vo", "li"],
    fullWord: "voli",
  },
  waris: {
    name: "Wajan",
    icon: "🍳",
    syllables: ["wa", "jan"],
    fullWord: "wajan",
  },
  xerox: {
    name: "Xerox",
    icon: "📋",
    syllables: ["xe", "rox"],
    fullWord: "xerox",
  },
  yogurt: {
    name: "Yogurt",
    icon: "🥛",
    syllables: ["yo", "gurt"],
    fullWord: "yogurt",
  },
  zebra: {
    name: "Zebra",
    icon: "🦓",
    syllables: ["ze", "bra"],
    fullWord: "zebra",
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
      selectBenda(bendaKey);
    });
  });

  // Listen button on main board
  const btnListen = document.getElementById("btnListenBenda");
  if (btnListen) {
    btnListen.addEventListener("click", () => {
      if (currentBenda) {
        playBendaSound(bendaData[currentBenda].fullWord);
      }
    });
  }

  // Listen button on spelling screen
  const btnListenSpelling = document.getElementById("btnListenSpelling");
  if (btnListenSpelling) {
    btnListenSpelling.addEventListener("click", () => {
      if (currentBenda) {
        playBendaSound(bendaData[currentBenda].fullWord);
      }
    });
  }
}

function selectBenda(bendaKey) {
  if (!bendaData[bendaKey]) return;

  currentBenda = bendaKey;
  const benda = bendaData[bendaKey];

  // Update display board
  displayBendaBoard(benda);

  // Play sound automatically
  playBendaSound(benda.fullWord);
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

console.log("Benda.js loaded!");
