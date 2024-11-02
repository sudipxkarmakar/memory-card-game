const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cardDeck = [...cardValues, ...cardValues];
let matchedCards = [];
let flippedCards = [];
let score = 0;
let timeRemaining = 60;
let timerInterval;
const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restart');
const flipSound = new Audio('flip.mp3'); // Load flip sound
const winSound = new Audio('win.mp3'); // Load win sound

// Shuffle cards function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create cards on the board
function createCards() {
    shuffle(cardDeck);
    cardDeck.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

let isFlipping = false; // Flag to control card flipping

// Flip card function
function flipCard(card) {
    if (!isFlipping && flippedCards.length < 2 && !matchedCards.includes(card)) {
        isFlipping = true; // Set the flag to prevent rapid flipping
        card.classList.add('flipped');
        card.innerText = card.dataset.value;

        // Play flip sound
        flipSound.currentTime = 0; // Reset audio to the start
        flipSound.play();

        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }

        // Reset the flag after a delay to allow time for the sound to play
        setTimeout(() => {
            isFlipping = false;
        }, 1000); // Match this duration with the card flip delay
    }
}


// Check for match function
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchedCards.push(firstCard, secondCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        winSound.play(); // Play win sound
        flippedCards = [];
        updateScore(); // Update score on match
        if (matchedCards.length === cardDeck.length) {
            alert('You win!');
            clearInterval(timerInterval);
        }
    } else {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerText = '';
        secondCard.innerText = '';
        flippedCards = [];
        score++; // Increment score for each attempt
        updateScore(); // Update score
    }
}

// Update score display function
function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer').innerText = `Time: ${timeRemaining}`;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Game Over!');
            restartGame();
        }
    }, 1000);
}

// Restart the game function
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
