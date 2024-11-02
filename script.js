const cardValues = ['1', '2', '3', '4', '5', '6', '7', '8'];
let cardDeck = [...cardValues, ...cardValues];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let timeRemaining = 60;
let timerInterval;

const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');
const flipSound = document.getElementById('flipSound');
const winSound = document.getElementById('winSound');
const loseSound = document.getElementById('loseSound');

// Create card elements
function createCards() {
    cardDeck.sort(() => 0.5 - Math.random());
    cardDeck.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Flip card function
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        flipSound.currentTime = 0; // Reset audio to the start
        flipSound.play(); // Play flip sound
        this.classList.add('flipped');
        this.innerText = this.dataset.value;
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

// Check for match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchedCards.push(firstCard, secondCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        flippedCards = [];
        score++;
        updateScore(); // Update score on match
        if (matchedCards.length === cardDeck.length) {
            winSound.currentTime = 0; // Reset audio to the start
            winSound.play(); // Play win sound
            alert('You win!');
        }
    } else {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerText = '';
        secondCard.innerText = '';
        flippedCards = [];
    }
}

// Update score display function
function updateScore() {
    scoreDisplay.innerText = `Score: ${score}`;
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.innerText = `Time: ${timeRemaining}`;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            loseSound.currentTime = 0; // Reset audio to the start
            loseSound.play(); // Play losing sound
            alert('Time is up! Game Over!');
            restartGame();
        }
    }, 1000);
}

// Restart the game
function restartGame() {
    gameBoard.innerHTML = '';
    cardDeck = [...cardValues, ...cardValues];
    matchedCards = [];
    score = 0; // Reset score
    timeRemaining = 60; // Reset timer
    clearInterval(timerInterval); // Clear previous timer
    updateScore(); // Update score display
    createCards();
    startTimer(); // Start new timer
}

// Initialize the game
restartButton.addEventListener('click', restartGame);
createCards();
startTimer();
