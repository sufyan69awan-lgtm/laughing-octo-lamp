// ==========================================
//  State
// ==========================================
let currentChapter = 0;
let activeIntervals = [];
let activeTimeouts = [];

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
  // Cancel any running intervals and timeouts
  activeIntervals.forEach(clearInterval);
  activeTimeouts.forEach(clearTimeout);
  activeIntervals = [];
  activeTimeouts = [];

  // Hide all chapters and reset their text + opacity
  chapters.forEach((ch) => {
    ch.classList.remove("show");
    const elements = ch.querySelectorAll("p, h2, h4");
    elements.forEach((el) => {
      const saved = el.getAttribute("data-fulltext");
      if (saved) el.textContent = saved;
      el.style.opacity = 0;
    });
  });

  currentChapter = index;
  const chapter = chapters[currentChapter];
  chapter.classList.add("show");

  typeAndFadeChapter(chapter);
}

// ==========================================
//  Typing + Fade-in Effect
// ==========================================
function typeAndFadeChapter(chapter) {
  const elements = chapter.querySelectorAll("p, h2, h4");

  elements.forEach((el, i) => {
    // Always read from saved full text to avoid alignment issues
    const fullText = (
      el.getAttribute("data-fulltext") || el.textContent
    ).trim();
    el.setAttribute("data-fulltext", fullText);
    el.textContent = "";
    el.style.opacity = 0;

    const delay = i * 800;

    const timeout = setTimeout(() => {
      // Fade in
      let fadeOpacity = 0;
      const fadeInterval = setInterval(() => {
        fadeOpacity += 0.05;
        if (fadeOpacity >= 1) {
          fadeOpacity = 1;
          clearInterval(fadeInterval);
        }
        el.style.opacity = fadeOpacity;
      }, 40);
      activeIntervals.push(fadeInterval);

      // Typing
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          el.textContent += fullText[charIndex];
          charIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50);
      activeIntervals.push(typingInterval);
    }, delay);

    activeTimeouts.push(timeout);
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
  e.stopPropagation();
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

// ==========================================
//  Starfield Animation
// ==========================================
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];
let shootingStars = [];
const numStars = 120;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.2,
    alpha: Math.random(),
    alphaChange: Math.random() * 0.02 + 0.005,
  });
}

function createShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: (Math.random() * canvas.height) / 2,
    len: Math.random() * 150 + 100,
    speed: Math.random() * 8 + 6,
    angle: (Math.random() * Math.PI) / 6 + Math.PI / 10,
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
    s.alpha += s.alphaChange;
    if (s.alpha > 1 || s.alpha < 0) s.alphaChange *= -1;
  });

  shootingStars.forEach((s, idx) => {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(
      s.x - s.len * Math.cos(s.angle),
      s.y + s.len * Math.sin(s.angle),
    );
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    s.x += s.speed * Math.cos(s.angle);
    s.y -= s.speed * Math.sin(s.angle);

    if (
      s.x - s.len * Math.cos(s.angle) > canvas.width ||
      s.y + s.len * Math.sin(s.angle) < 0
    ) {
      shootingStars.splice(idx, 1);
    }
  });

  requestAnimationFrame(animateStars);
}

setInterval(
  () => {
    if (Math.random() < 0.7) createShootingStar();
  },
  Math.random() * 3000 + 2000,
);

animateStars();
