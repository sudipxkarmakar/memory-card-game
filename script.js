const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

const flipSound = document.getElementById('flipSound');
const win = document.getElementById('win');
const finalWin = document.getElementById('finalWin');
const loseSound = document.getElementById('loseSound');

let cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];
let cardDeck = [...cardValues];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let timeRemaining = 60;
let timerInterval;

// Shuffle the deck and create cards
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function createCards() {
    shuffleDeck(cardDeck);
    gameBoard.innerHTML = '';
    cardDeck.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard(event) {
    const card = event.target;

    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length === 2) {
        return;
    }

    flipSound.currentTime = 0;
    flipSound.play();

    card.classList.add('flipped');
    card.innerText = card.dataset.value;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchedCards.push(firstCard, secondCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        flippedCards = [];

        // Play the match sound for each matched pair
        win.currentTime = 0;
        win.play();

        if (matchedCards.length === cardDeck.length) {
            clearInterval(timerInterval); // Stop the timer
            setTimeout(() => {
                finalWin.currentTime = 0;
                finalWin.play();
            }, 300);

            setTimeout(() => {
                alert('Congratulations! You win!');
                restartGame();
            }, 800);
        }
    } else {
        score++;
        updateScore();
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerText = '';
            secondCard.innerText = '';
            flippedCards = [];
        }, 1000);
    }
}

function updateScore() {
    scoreDisplay.innerText = `Score: ${score}`;
}

function startTimer() {
    timerDisplay.innerText = `Time: ${timeRemaining}`;
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.innerText = `Time: ${timeRemaining}`;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            loseSound.currentTime = 0;
            loseSound.play();
            setTimeout(() => {
                alert('Time is up! Game Over!');
                restartGame();
            }, 300);
        }
    }, 1000);
}

function restartGame() {
    gameBoard.innerHTML = '';
    cardDeck = [...cardValues];
    matchedCards = [];
    flippedCards = [];
    score = 0;
    timeRemaining = 60;
    clearInterval(timerInterval);
    updateScore();
    startTimer();
    createCards();
}

restartButton.addEventListener('click', restartGame);

// Initialize the game
createCards();
startTimer();
