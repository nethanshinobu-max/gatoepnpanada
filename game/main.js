// Game state
let catX = 100;
let catY = 100;
let heartX = 300;
let heartY = 300;
let heartVelX = 3;
let heartVelY = 3;
let heartSpeed = 3;
let lives = 3;
let isGameOver = false;
const catSpeed = 20;

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
    catY -= catSpeed;
  }
  if (keys['ArrowDown'] && catY < window.innerHeight - 50) {
    catY += catSpeed;
  }
  if (keys['ArrowLeft'] && catX > 0) {
    catX -= catSpeed;
  }
  if (keys['ArrowRight'] && catX < window.innerWidth - 50) {
    catX += catSpeed;
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
  heartSpeed *= 1.05;
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
      heartVelX = (Math.random() - 0.5) * 6;
      heartVelY = (Math.random() - 0.5) * 6;
      heartSpeed = 3;
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
  lives = 3;
  isGameOver = false;
  catX = 100;
  catY = 100;
  heartX = 300;
  heartY = 300;
  heartVelX = 3;
  heartVelY = 3;
  heartSpeed = 3;
  
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
