const gameBoard = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');

let cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cardDeck = [...cardValues, ...cardValues]; // Duplicate values for pairs
let flippedCards = [];
let matchedCards = [];

// Shuffle the cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create card elements
function createCards() {
    shuffle(cardDeck).forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Handle card flip
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.innerText = this.dataset.value;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

let score = 0;

// Update score display function
function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

// Check for match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchedCards.push(firstCard, secondCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        flippedCards = [];
        updateScore(); // Update score on match
        if (matchedCards.length === cardDeck.length) {
            alert('You win!');
        }
    } else {
        score++; // Increment score for each attempt
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerText = '';
        secondCard.innerText = '';
        flippedCards = [];
        updateScore(); // Update score
    }
}

let timeRemaining = 60;
let timerInterval;

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

// Modify the restart button event listener
restartButton.addEventListener('click', restartGame);

// Start the game with the timer
createCards();
startTimer();
