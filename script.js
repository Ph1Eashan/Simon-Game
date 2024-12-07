let gameSequence = [];  // Stores the sequence the game generates
let playerSequence = []; // Stores the player's sequence
let level = 0;           // Tracks the current level
let isGameActive = false;
const startBtn = document.getElementById("start-btn");
const startOverBtn = document.getElementById("start-over-btn");
const message = document.getElementById("message");
const levelText = document.getElementById("level-text");
const tiles = document.querySelectorAll(".color-tile");

// Sound files for tiles
const correctSound = new Audio("sounds/correct.mp3"); // For all correct tiles
const wrongSound = new Audio("sounds/wrong.mp3"); // For incorrect clicks

// Show start button only on small screens
if (window.innerWidth < 600) {
  startBtn.style.display = "inline-block";
} else {
  levelText.textContent = "Press any key to start";
}

// Start the game on key press or start button click
document.addEventListener("keydown", startGame);
startBtn.addEventListener("click", startGame);
startOverBtn.addEventListener("click", startGame);  // Restart the game on "Start Over" button click

function startGame() {
  if (!isGameActive) {
    resetGame();
    nextLevel();
  }
}

// Reset game
function resetGame() {
  gameSequence = [];
  playerSequence = [];
  level = 0;
  isGameActive = true;
  message.textContent = "";
  levelText.textContent = `Level ${level}`;
  document.body.style.backgroundColor = ""; // Reset background flicker
  
  // Hide Start button and show Start Over button
  startBtn.style.display = "none";
  startOverBtn.style.display = "none";  // Hide Start Over button when starting a new game
}

// Start the next level
function nextLevel() {
  level++;
  playerSequence = [];
  levelText.textContent = `Level ${level}`;
  
  // Add a new tile to the game sequence
  const randomColor = tiles[Math.floor(Math.random() * tiles.length)].dataset.color;
  gameSequence.push(randomColor);

  // Show only the new color for this level
  setTimeout(() => playSequence(randomColor), 500);  // Show only the new tile after a short delay
}

// Play the sequence - only the new tile
function playSequence(newColor) {
  highlightTile(newColor);
  playSound();  // Play the common sound for the new tile
}

// Highlight tile with animation
function highlightTile(color) {
  const tile = document.querySelector(`.color-tile[data-color="${color}"]`);
  tile.classList.add("active");

  // Flicker animation (tile glows briefly)
  setTimeout(() => tile.classList.remove("active"), 500);
}

// Play sound for the tile (correct tile)
function playSound() {
  correctSound.play();  // Play the same sound for all correct tiles
}

// Handle player click
tiles.forEach(tile => {
  tile.addEventListener("click", () => {
    if (!isGameActive) return;  // Prevent interaction if game is over
    const selectedColor = tile.dataset.color;
    playerSequence.push(selectedColor);
    
    highlightTile(selectedColor);
    playSound();

    checkPlayerMove();
  });
});

// Check player's move
function checkPlayerMove() {
  const currentMoveIndex = playerSequence.length - 1;

  // If the player's move is wrong, play the wrong sound and end the game
  if (playerSequence[currentMoveIndex] !== gameSequence[currentMoveIndex]) {
    wrongSound.play();  // Play the wrong sound when an incorrect tile is clicked
    handleLoss();       // Handle the loss (flicker and reset)
  } else if (playerSequence.length === gameSequence.length) {
    setTimeout(nextLevel, 1000); // Move to next level after delay
  }
}

// Handle game loss (incorrect move)
function handleLoss() {
  levelText.textContent = "Snap! You lost, press any key to restart";
  
  // Flicker red three times
  let flickerCount = 0;
  const flickerInterval = setInterval(() => {
    document.body.style.backgroundColor = (flickerCount % 2 === 0) ? "red" : ""; // Toggle red on/off
    flickerCount++;

    // Stop flickering after 3 times
    if (flickerCount >= 6) {
      clearInterval(flickerInterval);  // Stop the interval after 3 flickers (6 changes)
      document.body.style.backgroundColor = ""; // Ensure background is reset
    }
  }, 300);  // 300ms flicker interval
  
  // Show Start Over button and hide Start button
  startOverBtn.style.display = "inline-block"; 
  startBtn.style.display = "none"; // Hide Start button after the game ends

  isGameActive = false;  // Game ends after loss
}
