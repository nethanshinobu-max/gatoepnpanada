// Gato vs Corazón - Mini juego con vidas y contador de tiempo
const W = 640, H = 360;

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: W,
  height: H,
  backgroundColor: "#141824",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let player, corazon, cursors;
let lives = 3;
let livesText, timerText, infoText;
let runStartTime = 0;
let isDead = false;
let isGameOver = false;
let totalSurvival = 0;
let lastRunTime = 0;
let restartKey;

function preload() {
  // Generamos texturas simples (placeholders) para el gato y el corazón
  const g = this.add.graphics();

  // Gato vivo
  g.clear();
  g.fillStyle(0xf4d06f, 1); // cara
  g.fillCircle(16, 18, 14);
  g.fillStyle(0xf4d06f, 1); // orejas
  g.fillTriangle(6, 8, 12, 2, 14, 12);
  g.fillTriangle(18, 12, 20, 2, 26, 8);
  g.fillStyle(0x000000, 1); // ojos
  g.fillCircle(12, 18, 2);
  g.fillCircle(20, 18, 2);
  g.generateTexture("gatoVivo", 32, 32);

  // Gato muerto
  g.clear();
  g.fillStyle(0x808080, 1);
  g.fillCircle(16, 18, 14);
  g.fillStyle(0x808080, 1);
  g.fillTriangle(6, 8, 12, 2, 14, 12);
  g.fillTriangle(18, 12, 20, 2, 26, 8);
  g.lineStyle(2, 0xff0033, 1); // X en los ojos
  g.beginPath();
  g.moveTo(10, 16); g.lineTo(14, 20);
  g.moveTo(14, 16); g.lineTo(10, 20);
  g.moveTo(18, 16); g.lineTo(22, 20);
  g.moveTo(22, 16); g.lineTo(18, 20);
  g.strokePath();
  g.generateTexture("gatoMuerto", 32, 32);

  // Corazón (simplificado: dos círculos y un triángulo)
  g.clear();
  g.fillStyle(0xff3b6e, 1);
  g.fillCircle(12, 12, 6);
  g.fillCircle(20, 12, 6);
  g.fillTriangle(8, 14, 24, 14, 16, 26);
  g.generateTexture("corazon", 32, 32);

  g.destroy();
}

function create() {
  // Fondo simple
  this.add.rectangle(W / 2, H / 2, W, H, 0x1b2238);
  this.add.rectangle(W / 2, H / 2 + 40, W, H / 2, 0x22304a).setAlpha(0.6);

  // Jugador (gato)
  player = this.physics.add.sprite(W / 2, H / 2, "gatoVivo");
  player.setCollideWorldBounds(true);

  // Corazón que rebota y acelera
  corazon = this.physics.add.sprite(Phaser.Math.Between(32, W - 32), Phaser.Math.Between(32, H - 32), "corazon");
  corazon.setCollideWorldBounds(true, 1, 1);
  corazon.body.onWorldBounds = true;
  corazon.setBounce(1, 1);
  // Velocidad inicial
  setHeartVelocity(corazon, 220);

  // Acelerar en cada rebote con la pared
  this.physics.world.on("worldbounds", (body) => {
    if (body.gameObject === corazon) {
      accelerateHeart(corazon, 1.06, 950); // 6% por rebote, tope ~950 px/s
    }
  });

  // Controles
  cursors = this.input.keyboard.createCursorKeys();
  restartKey = this.input.keyboard.addKey("R");

  // UI
  livesText = this.add.text(10, 10, `Vidas: ${lives}`, { fontFamily: "monospace", fontSize: "14px", color: "#ffffff" }).setScrollFactor(0);
  timerText = this.add.text(10, 28, `Tiempo: 0.0 s`, { fontFamily: "monospace", fontSize: "14px", color: "#a0ffd6" }).setScrollFactor(0);
  infoText = this.add.text(W - 10, 10, `Reiniciar: R`, { fontFamily: "monospace", fontSize: "14px", color: "#ffffff" }).setOrigin(1, 0).setScrollFactor(0);

  // Colisión gato-corazón
  this.physics.add.overlap(player, corazon, () => onHit.call(this), undefined, this);

  runStartTime = this.time.now;
}

function update() {
  if (isGameOver) {
    if (Phaser.Input.Keyboard.JustDown(restartKey)) {
      fullRestart.call(this);
    }
    return;
  }
  if (isDead) return;

  const speed = 170;
  player.setVelocity(0);
  if (cursors.left.isDown) player.setVelocityX(-speed);
  else if (cursors.right.isDown) player.setVelocityX(speed);
  if (cursors.up.isDown) player.setVelocityY(-speed);
  else if (cursors.down.isDown) player.setVelocityY(speed);

  // Actualizar contador de tiempo
  const elapsed = (this.time.now - runStartTime) / 1000;
  timerText.setText(`Tiempo: ${elapsed.toFixed(1)} s`);
}

function setHeartVelocity(heart, baseSpeed) {
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  heart.setVelocity(Math.cos(angle) * baseSpeed, Math.sin(angle) * baseSpeed);
}

function accelerateHeart(heart, factor, maxSpeed) {
  const vx = heart.body.velocity.x;
  const vy = heart.body.velocity.y;
  const speed = Math.sqrt(vx * vx + vy * vy);
  const newSpeed = Math.min(speed * factor, maxSpeed);
  // Mantener dirección, aumentar magnitud
  const angle = Math.atan2(vy, vx);
  heart.setVelocity(Math.cos(angle) * newSpeed, Math.sin(angle) * newSpeed);
}

function onHit() {
  if (isDead || isGameOver) return;
  isDead = true;

  // Pausar física y mostrar gato muerto
  this.physics.pause();
  player.setTexture("gatoMuerto");

  // Calcular tiempo de esta vida
  lastRunTime = (this.time.now - runStartTime) / 1000;
  totalSurvival += lastRunTime;

  // Overlay de muerte
  const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6);
  const msg = this.add.text(W / 2, H / 2 - 20, "¡El corazón te tocó!", { fontFamily: "monospace", fontSize: "20px", color: "#ff8ea3" }).setOrigin(0.5);
  const stats = this.add.text(W / 2, H / 2 + 10, `Tiempo de esta vida: ${lastRunTime.toFixed(1)} s`, { fontFamily: "monospace", fontSize: "16px", color: "#ffffff" }).setOrigin(0.5);

  lives -= 1;
  livesText.setText(`Vidas: ${lives}`);

  this.time.delayedCall(1200, () => {
    overlay.destroy(); msg.destroy(); stats.destroy();
    if (lives > 0) {
      // Reiniciar run
      this.physics.resume();
      player.setTexture("gatoVivo");
      player.setPosition(W / 2, H / 2);

      corazon.setPosition(Phaser.Math.Between(32, W - 32), Phaser.Math.Between(32, H - 32));
      setHeartVelocity(corazon, 240); // reinicia rápido
      runStartTime = this.time.now;
      isDead = false;
    } else {
      showGameOver.call(this);
    }
  });
}

function showGameOver() {
  isGameOver = true;

  const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7);
  const title = this.add.text(W / 2, H / 2 - 30, "GAME OVER - Gato Muerto", { fontFamily: "monospace", fontSize: "22px", color: "#ff3b6e" }).setOrigin(0.5);
  const sumText = this.add.text(W / 2, H / 2 + 2, `Total sobrevivido: ${totalSurvival.toFixed(1)} s`, { fontFamily: "monospace", fontSize: "18px", color: "#ffffff" }).setOrigin(0.5);
  const hint = this.add.text(W / 2, H / 2 + 30, "Presiona R para reiniciar", { fontFamily: "monospace", fontSize: "16px", color: "#a0ffd6" }).setOrigin(0.5);

  // Guardar referencias para limpiar al reiniciar
  this._gameOverUI = [overlay, title, sumText, hint];
}

function fullRestart() {
  // Limpiar UI de Game Over
  if (this._gameOverUI) this._gameOverUI.forEach(el => el.destroy());

  // Reset de estado
  isDead = false;
  isGameOver = false;
  lives = 3;
  totalSurvival = 0;
  livesText.setText(`Vidas: ${lives}`);

  // Reset de entidades
  player.setTexture("gatoVivo");
  player.setPosition(W / 2, H / 2);

  corazon.setPosition(Phaser.Math.Between(32, W - 32), Phaser.Math.Between(32, H - 32));
  setHeartVelocity(corazon, 240);

  // Reanudar y reiniciar contador
  this.physics.resume();
  runStartTime = this.time.now;
}

new Phaser.Game(config);
