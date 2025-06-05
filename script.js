
/* ------------------------------------------------------------------
   Memory‑Match logic  +  Fireworks on every successful match
------------------------------------------------------------------ */

/* ---------- 1.  GAME SET‑UP ---------- */
const gameContainer     = document.getElementById('gameContainer');
const flippedCountElem  = document.getElementById('flippedCount');
const matchesCountElem  = document.getElementById('matchesCount');
const resetBtn          = document.getElementById('resetBtn');

const emojis = ['🍎','🍌','🍇','🍓','🥝','🍍','🍉','🍒'];   // 8 pairs
let deck           = [];
let flippedCards   = [];
let matchesFound   = 0;
let flippedCount   = 0;
let canClick       = true;

/* ---------- 2.  FIREWORKS ENGINE ---------- */
// <canvas> already exists in your HTML.
const fwCanvas = document.getElementById('fireworks-canvas');
const fwCtx    = fwCanvas.getContext('2d');
resizeCanvas();

let particles = [];

function resizeCanvas() {
  fwCanvas.width  = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

function spawnFirework(x, y, n = 24) {
  for (let i = 0; i < n; i++) {
    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 7,
      dy: (Math.random() - 0.5) * 7,
      life: 1,
      color: `hsl(${Math.random()*360},100%,60%)`
    });
  }
}

function updateFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.x   += p.dx;
    p.y   += p.dy + 0.3;         // gravity
    p.dx *= 0.98;                // drag
    p.dy *= 0.98;
    p.life -= 0.02;

    fwCtx.globalAlpha = p.life;
    fwCtx.fillStyle   = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    fwCtx.fill();
  });

  fwCtx.globalAlpha = 1;
  requestAnimationFrame(updateFireworks);
}
updateFireworks();

/* ---------- 3.  GAME FUNCTIONS ---------- */
function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random()* (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDeck(){
  deck = shuffle([...emojis, ...emojis]);  // duplicate & shuffle
}

function createCard(emoji, index){
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.emoji = emoji;
  card.dataset.index = index;
  card.textContent   = '';        // face‑down

  card.addEventListener('click', () => {
    if (!canClick) return;
    if (
      flippedCards.length < 2 &&
      !card.classList.contains('flipped') &&
      !flippedCards.includes(card)
    ){
      flipCard(card);
    }
  });

  return card;
}

function flipCard(card){
  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  flippedCards.push(card);
  flippedCountElem.textContent = ++flippedCount;

  if (flippedCards.length === 2) checkMatch();
}

function checkMatch(){
  canClick = false;
  const [c1, c2] = flippedCards;

  if (c1.dataset.emoji === c2.dataset.emoji){
    // === MATCH FOUND ===
    matchesCountElem.textContent = ++matchesFound;
    celebrateMatch(c1, c2);
    flippedCards = [];
    canClick = true;

    if (matchesFound === emojis.length){
      setTimeout(() => {
        // grand finale fireworks in screen center
        spawnFirework(window.innerWidth/2, window.innerHeight/2, 60);
        alert('🎉 Congratulations! You matched all cards!');
      }, 300);
    }
  } else {
    // === NO MATCH ===
    setTimeout(() => {
      [c1, c2].forEach(card => {
        card.classList.remove('flipped');
        card.textContent = '';
      });
      flippedCards = [];
      canClick = true;
    }, 1000);
  }
}

function celebrateMatch(cardA, cardB){
  // Spawn fireworks over each matched card
  [cardA, cardB].forEach(card => {
    const r = card.getBoundingClientRect();
    const x = r.left + r.width/2;
    const y = r.top  + r.height/2;
    spawnFirework(x, y);
  });
}

function initGame(){
  createDeck();
  gameContainer.innerHTML = '';
  flippedCards   = [];
  matchesFound   = 0;
  flippedCount   = 0;
  flippedCountElem.textContent = '0';
  matchesCountElem.textContent = '0';
  canClick       = true;

  deck.forEach((emoji, idx) => gameContainer.appendChild(createCard(emoji, idx)));
}

resetBtn.addEventListener('click', initGame);
window.addEventListener('load', initGame);
