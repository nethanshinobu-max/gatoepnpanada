// Game constants
const INITIAL_HEART_SPEED = 3;
const INITIAL_LIVES = 3;
const CAT_SPEED = 20;
const ACCELERATION_MULTIPLIER = 1.05;
const MAX_RANDOM_VELOCITY = 6;

// Game state
let catX = 100;
let catY = 100;
let heartX = 300;
let heartY = 300;
let heartVelX = INITIAL_HEART_SPEED;
let heartVelY = INITIAL_HEART_SPEED;
let heartSpeed = INITIAL_HEART_SPEED;
let lives = INITIAL_LIVES;
let isGameOver = false;

// DOM elements
const cat = document.getElementById('cat');
const heart = document.getElementById('heart');
const livesDisplay = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');

// Initialize positions
cat.style.left = catX + 'px';
cat.style.top = catY + 'px';
heart.style.left = heartX + 'px';
heart.style.top = heartY + 'px';

// Keyboard controls
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  
  // Restart game with R
  if (e.key === 'r' || e.key === 'R') {
    if (isGameOver) {
      restartGame();
    }
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Move cat
function moveCat() {
  if (isGameOver) return;
  
  if (keys['ArrowUp'] && catY > 0) {
    catY -= CAT_SPEED;
  }
  if (keys['ArrowDown'] && catY < window.innerHeight - 50) {
    catY += CAT_SPEED;
  }
  if (keys['ArrowLeft'] && catX > 0) {
    catX -= CAT_SPEED;
  }
  if (keys['ArrowRight'] && catX < window.innerWidth - 50) {
    catX += CAT_SPEED;
  }
  
  cat.style.left = catX + 'px';
  cat.style.top = catY + 'px';
}

// Move heart (bouncing and accelerating)
function moveHeart() {
  if (isGameOver) return;
  
  heartX += heartVelX;
  heartY += heartVelY;
  
  // Bounce off edges
  if (heartX <= 0 || heartX >= window.innerWidth - 40) {
    heartVelX = -heartVelX;
    accelerateHeart();
  }
  if (heartY <= 0 || heartY >= window.innerHeight - 40) {
    heartVelY = -heartVelY;
    accelerateHeart();
  }
  
  heart.style.left = heartX + 'px';
  heart.style.top = heartY + 'px';
}

// Accelerate heart on bounce
function accelerateHeart() {
  heartSpeed *= ACCELERATION_MULTIPLIER;
  const angle = Math.atan2(heartVelY, heartVelX);
  heartVelX = Math.cos(angle) * heartSpeed;
  heartVelY = Math.sin(angle) * heartSpeed;
}

// Check collision
function checkCollision() {
  if (isGameOver) return;
  
  const catRect = cat.getBoundingClientRect();
  const heartRect = heart.getBoundingClientRect();
  
  if (
    catRect.left < heartRect.right &&
    catRect.right > heartRect.left &&
    catRect.top < heartRect.bottom &&
    catRect.bottom > heartRect.top
  ) {
    lives--;
    livesDisplay.textContent = 'Vidas: ' + lives;
    
    if (lives <= 0) {
      gameOver();
    } else {
      // Reset heart position
      heartX = Math.random() * (window.innerWidth - 100) + 50;
      heartY = Math.random() * (window.innerHeight - 100) + 50;
      heartVelX = (Math.random() - 0.5) * MAX_RANDOM_VELOCITY;
      heartVelY = (Math.random() - 0.5) * MAX_RANDOM_VELOCITY;
      heartSpeed = INITIAL_HEART_SPEED;
    }
  }
}

// Game over
function gameOver() {
  isGameOver = true;
  gameOverScreen.classList.add('show');
}

// Restart game
function restartGame() {
  lives = INITIAL_LIVES;
  isGameOver = false;
  catX = 100;
  catY = 100;
  heartX = 300;
  heartY = 300;
  heartVelX = INITIAL_HEART_SPEED;
  heartVelY = INITIAL_HEART_SPEED;
  heartSpeed = INITIAL_HEART_SPEED;
  
  livesDisplay.textContent = 'Vidas: ' + lives;
  gameOverScreen.classList.remove('show');
  
  cat.style.left = catX + 'px';
  cat.style.top = catY + 'px';
  heart.style.left = heartX + 'px';
  heart.style.top = heartY + 'px';
}

// Game loop
function gameLoop() {
  moveCat();
  moveHeart();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
