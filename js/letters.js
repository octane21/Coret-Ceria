// ===== BELAJAR HURUF =====

const alphabet = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  lowercase: "abcdefghijklmnopqrstuvwxyz".split(""),
};

let currentLetter = "a";
let isShowingUppercase = false;
let count = 1;

document.addEventListener("DOMContentLoaded", () => {
  initLetters();
});

function initLetters() {
  const grid = document.querySelector(".huruf-grid");
  if (!grid) return;
  // Clear grid
  grid.innerHTML = "";
  // Create buttons for lowercase letters (shown first)
  alphabet.lowercase.forEach((letter) => {
    const btn = document.createElement("button");
    btn.className = "huruf-btn";
    btn.textContent = letter;
    btn.addEventListener("click", () => selectLetter(letter));
    grid.appendChild(btn);
  });

  // Switch button
  const switchBtn = document.querySelector("#btnSwitchCase");
  if (switchBtn) {
    switchBtn.addEventListener("click", switchLetterCase);
  }

  // Sound button
  const soundBtn = document.querySelector(".btn-suara");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => playLetterSound(currentLetter));
  }

  // Select first letter by default (lowercase 'a')
  // selectLetter("a");
  let audio = document.getElementById("letterAudio");
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "letterAudio";
    document.body.appendChild(audio);
  }

  // Set source to mp3 file from sounds folder
  const soundPath = `../sounds/introhuruf.mp3`;
  audio.src = soundPath;
  audio.volume = 1;

  // Play the audio
  audio.play().catch((error) => {
    console.log(`Error playing sound`, error);
  });
  // if(count == 1){
  selectLetter("a");
  // }
}

function selectLetter(letter) {
  currentLetter = letter;

  // Update all buttons
  document.querySelectorAll(".huruf-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.textContent === letter) {
      btn.classList.add("active");
    }
  });

  // Update display
  const display = document.querySelector(".huruf-besar");
  const name = document.querySelector(".huruf-nama");

  if (display) display.textContent = letter;
  if (name) name.textContent = `Huruf ${letter}`;

  // Play sound
  playLetterSound(letter);
}

function switchLetterCase() {
  const grid = document.querySelector(".huruf-grid");
  const switchBtn = document.querySelector("#btnSwitchCase");

  if (!grid || !switchBtn) return;

  isShowingUppercase = !isShowingUppercase;

  // Clear grid
  grid.innerHTML = "";

  if (isShowingUppercase) {
    // Show uppercase letters
    alphabet.uppercase.forEach((letter) => {
      const btn = document.createElement("button");
      btn.className = "huruf-btn";
      btn.textContent = letter;
      btn.addEventListener("click", () => selectLetter(letter));
      grid.appendChild(btn);
    });
    switchBtn.textContent = "Huruf Kecil";
  } else {
    // Show lowercase letters
    alphabet.lowercase.forEach((letter) => {
      const btn = document.createElement("button");
      btn.className = "huruf-btn";
      btn.textContent = letter;
      btn.addEventListener("click", () => selectLetter(letter));
      grid.appendChild(btn);
    });
    switchBtn.textContent = "Huruf Besar";
  }

  // Select first letter based on current case
  const firstLetter = isShowingUppercase ? "A" : "a";
  selectLetter(firstLetter);
}

function playLetterSound(letter) {
  console.log(count)
  // Check if sound is muted
  if (typeof canPlaySound === "function" && !canPlaySound()) {
    return;
  }

  // Convert to lowercase for file naming
  const letterLower = letter.toLowerCase();
  if(count != 1){

    // Create audio element if it doesn't exist
    let audio = document.getElementById("letterAudio");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "letterAudio";
      document.body.appendChild(audio);
    }
    
    // Set source to mp3 file from sounds folder
    const soundPath = `../sounds/${letterLower}.mp3`;
    audio.src = soundPath;
    audio.volume = 1;
    
    // Play the audio
  audio.play().catch((error) => {
    console.log(`Error playing sound for letter ${letterLower}:`, error);
  });

}
  // Visual feedback
  const btn = document.querySelector(".btn-suara");
  if (btn) {
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 100);
  }

  count = 2;
}

console.log("Letters.js loaded!");
