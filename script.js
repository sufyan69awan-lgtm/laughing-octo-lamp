// ==========================================
//  State
// ==========================================
let currentChapter = 0;
let activeIntervals = [];

const chapters = document.querySelectorAll(".chapter");
const startScreen = document.getElementById("startScreen");
const bgMusic = document.getElementById("bgMusic");
const progressBar = document.getElementById("progressBar");
const playBtnAudio = document.getElementById("playBtnAudio");

// ==========================================
//  Start Story
// ==========================================
function startStory() {
  startScreen.style.display = "none";
  showChapter(0);
}

// ==========================================
//  Show Chapter
// ==========================================
function showChapter(index) {
  // Cancel any running typing intervals
  activeIntervals.forEach(clearInterval);
  activeIntervals = [];

  // Hide all chapters and reset their text
  chapters.forEach((ch) => {
    ch.classList.remove("show");
    const elements = ch.querySelectorAll("p, h2, h4");
    elements.forEach((el) => {
      const saved = el.getAttribute("data-fulltext");
      if (saved) el.textContent = saved;
    });
  });

  currentChapter = index;
  const chapter = chapters[currentChapter];
  chapter.classList.add("show");

  typeChapter(chapter);
}

// ==========================================
//  Typing Effect
// ==========================================
function typeChapter(chapter) {
  const elements = chapter.querySelectorAll("p, h2, h4");

  elements.forEach((el) => {
    // Always read from saved full text, not current (possibly empty) content
    const fullText = el.getAttribute("data-fulltext") || el.textContent.trim();
    el.setAttribute("data-fulltext", fullText);
    el.textContent = "";

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        el.textContent += fullText[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, 35);

    activeIntervals.push(interval);
  });
}

// ==========================================
//  Navigation
// ==========================================
function nextChapter() {
  if (currentChapter < chapters.length - 1) {
    showChapter(currentChapter + 1);
  }
}

function prevChapter() {
  if (currentChapter > 0) {
    showChapter(currentChapter - 1);
  }
}

function restartStory() {
  showChapter(0);
}

// ==========================================
//  Music Controls
// ==========================================
let musicStarted = false;

function startMusicOnTouch() {
  if (!musicStarted) {
    bgMusic.volume = 0.2;
    bgMusic.play().catch(() => {});
    musicStarted = true;
    playBtnAudio.textContent = "⏸";
    window.removeEventListener("click", startMusicOnTouch);
    window.removeEventListener("touchstart", startMusicOnTouch);
  }
}

window.addEventListener("click", startMusicOnTouch);
window.addEventListener("touchstart", startMusicOnTouch);

// Toggle play/pause button
playBtnAudio.addEventListener("click", (e) => {
  e.stopPropagation(); // don't trigger startMusicOnTouch again
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    playBtnAudio.textContent = "⏸";
  } else {
    bgMusic.pause();
    playBtnAudio.textContent = "▶";
  }
});

// Progress bar
bgMusic.addEventListener("timeupdate", () => {
  if (bgMusic.duration) {
    const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
    progressBar.style.width = percent + "%";
  }
});
