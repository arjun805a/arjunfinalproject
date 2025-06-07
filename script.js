const form = document.getElementById('add-card-form');
const area = document.getElementById('flashcards-area');
const countSpan = document.getElementById('flipped-count');

let flippedCount = 0;
let cards = JSON.parse(localStorage.getItem('cardsV3')) || [];

function updateCount() {
  countSpan.textContent = flippedCount;
}

function saveToLocalStorage() {
  localStorage.setItem('cardsV3', JSON.stringify(cards));
}

function createCardElement(cardData, index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'card-wrapper';

  const card = document.createElement('div');
  card.className = 'card';
  card.style.backgroundColor = cardData.color;

  const front = document.createElement('div');
  front.className = 'card-side card-front';
  front.textContent = cardData.question;

  const back = document.createElement('div');
  back.className = 'card-side card-back';
  back.textContent = cardData.answer;

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.textContent = '×';

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cards.splice(index, 1);
    saveToLocalStorage();
    renderCards();
  });

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
    flippedCount++;
    updateCount();
  });

  card.appendChild(front);
  card.appendChild(back);
  wrapper.appendChild(card);
  wrapper.appendChild(delBtn);

  return wrapper;
}

function renderCards() {
  area.innerHTML = '';
  cards.forEach((card, index) => {
    const cardElement = createCardElement(card, index);
    area.appendChild(cardElement);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const question = document.getElementById('card-question').value.trim();
  const answer = document.getElementById('card-answer').value.trim();
  const color = document.getElementById('card-color').value;

  if (question && answer) {
    cards.push({ question, answer, color });
    saveToLocalStorage();
    renderCards();
    form.reset();
  }
});

renderCards();
updateCount();
