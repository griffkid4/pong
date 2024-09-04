// game.js
import { Particle } from './particle.js';
import { leftPaddle, rightPaddle } from './paddle.js';
import { ball, resetBall } from './ball.js';
import { drawMenu, selectedOption, showMenu } from './menu.js';

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let particles = [];
let leftScore = 0;
let rightScore = 0;
let isTwoPlayerMode = false;
let menuVisible = true; // Ensure this is initialized as true for the menu to show

export function createFirework(x, y) {
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(x, y));
  }
}

function handleParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(ctx);
    if (particles[i].lifespan <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.beginPath();
  ctx.setLineDash([5, 15]); // Dashed line for the center
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPaddle(paddle) {
  ctx.fillStyle = "white";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "36px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(leftScore, canvas.width / 4, 50);
  ctx.fillText(rightScore, (3 * canvas.width) / 4, 50);
}

function updatePaddles() {
  if (isTwoPlayerMode || leftPaddle.dy !== 0) {
    leftPaddle.y += leftPaddle.dy;
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    else if (leftPaddle.y + leftPaddle.height > canvas.height) {
      leftPaddle.y = canvas.height - leftPaddle.height;
    }
  }

  rightPaddle.y += rightPaddle.dy;
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  else if (rightPaddle.y + rightPaddle.height > canvas.height) {
    rightPaddle.y = canvas.height - rightPaddle.height;
  }
}

function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (detectCollision(leftPaddle, ball)) {
    ball.dx = -ball.dx;
    let collidePoint = ball.y - (leftPaddle.y + leftPaddle.height / 2);
    collidePoint = collidePoint / (leftPaddle.height / 2);
    let angleRad = (collidePoint * Math.PI) / 4;
    ball.dy = ball.speed * Math.sin(angleRad);
  }

  if (detectCollision(rightPaddle, ball)) {
    ball.dx = -ball.dx;
    let collidePoint = ball.y - (rightPaddle.y + rightPaddle.height / 2);
    collidePoint = collidePoint / (rightPaddle.height / 2);
    let angleRad = (collidePoint * Math.PI) / 4;
    ball.dy = ball.speed * Math.sin(angleRad);
  }

  if (ball.x + ball.radius > canvas.width) {
    leftScore++;
    if (leftScore >= 5) {
      resetGame();
    } else {
      resetBall();
    }
  } else if (ball.x - ball.radius < 0) {
    rightScore++;
    if (rightScore >= 5) {
      resetGame();
    } else {
      resetBall();
    }
  }
}

function detectCollision(paddle, ball) {
  if (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  ) {
    return true;
  }
  return false;
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  menuVisible = true;
}

function drawGame() {
  drawField();
  drawPaddle(leftPaddle);
  drawPaddle(rightPaddle);
  drawBall();
  drawScore();
}

function gameLoop() {
  if (menuVisible) {
    drawMenu(ctx, canvas);
  } else {
    updatePaddles();
    updateBall();
    drawGame();
    handleParticles();
  }
  requestAnimationFrame(gameLoop);
}

function startGame() {
  resetBall();
  menuVisible = false;
  isTwoPlayerMode = selectedOption === 1;
}

// Event listeners for paddle control
document.addEventListener("keydown", (event) => {
  if (isTwoPlayerMode) {
    if (event.key === "w") leftPaddle.dy = -5;
    if (event.key === "s") leftPaddle.dy = 5;
  }
  switch (event.code) {
    case "ArrowUp":
      rightPaddle.dy = -5;
      break;
    case "ArrowDown":
      rightPaddle.dy = 5;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  if (isTwoPlayerMode && (event.key === "w" || event.key === "s")) leftPaddle.dy = 0;
  if (event.code === "ArrowUp" || event.code === "ArrowDown") {
    rightPaddle.dy = 0;
  }
});

// Event listeners for menu control
document.addEventListener("keydown", (event) => {
  if (menuVisible) {
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      selectedOption = 1 - selectedOption; // Toggle between 1 Player and 2 Player
      drawMenu(ctx, canvas);
    } else if (event.code === "Enter") {
      startGame();
    }
  }
});

// Start the game loop
gameLoop();
