// Initialize game variables
let gameSequence = [];
let playerSequence = [];
let level = 0;

// Get DOM elements
const startBtn = document.getElementById("start-btn");
const message = document.getElementById("message");
const tiles = document.querySelectorAll(".color-tile");

// Start the game
startBtn.addEventListener("click", startGame);

function startGame() {
  resetGame();
  nextLevel();
}

// Reset game state
function resetGame() {
  gameSequence = [];
  playerSequence = [];
  level = 0;
  message.textContent = "";
}

// Generate a new level
function nextLevel() {
  level++;
  playerSequence = [];
  message.textContent = `Level ${level}`;
  const randomColor = tiles[Math.floor(Math.random() * tiles.length)].dataset.color;
  gameSequence.push(randomColor);
  playSequence();
}

// Play the sequence to the user
function playSequence() {
    let delay = 0;
  
    // Play each color in the sequence with a delay
    gameSequence.forEach((color) => {
      setTimeout(() => highlightTile(color), delay);
      delay += 700; // Increase the delay to ensure a smooth transition
    });
  }

// Highlight a tile
function highlightTile(color) {
    const tile = document.querySelector(`.color-tile[data-color="${color}"]`);
  
    // Add the active class to trigger the animation
    tile.classList.add("active");
  
    // Remove the active class after the animation duration
    setTimeout(() => {
      tile.classList.remove("active");
    }, 500); // Matches the duration of the CSS animation
  }

// Handle user clicks
tiles.forEach(tile => {
  tile.addEventListener("click", () => {
    const selectedColor = tile.dataset.color;
    playerSequence.push(selectedColor);
    highlightTile(selectedColor);
    checkPlayerMove();
  });
});

// Check player move
function checkPlayerMove() {
  const currentMoveIndex = playerSequence.length - 1;
  if (playerSequence[currentMoveIndex] !== gameSequence[currentMoveIndex]) {
    message.textContent = "Game Over! Press Start to try again.";
    return;
  }
  
  if (playerSequence.length === gameSequence.length) {
    setTimeout(nextLevel, 1000);
  }
}
