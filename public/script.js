class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1; // Random size
    this.speedX = Math.random() * 3 - 1.5; // Random X velocity
    this.speedY = Math.random() * 3 - 1.5; // Random Y velocity
    this.color =
      "rgb(" + [255, Math.floor(Math.random() * 256), 0].join(",") + ")"; // Random shade of red/orange
    this.lifespan = 100; // Lifespan of the particle
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.lifespan -= 1;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Set the dimensions of the canvas
canvas.width = 800;
canvas.height = 400;

let showMenu = true;
let selectedOption = 0; // 0 for '1 Player', 1 for '2 Player'
let difficulty = "medium"; // Default difficulty

let isTwoPlayerMode = false;

let leftScore = 0;
let rightScore = 0;
let particles = [];

function createFirework(x, y) {
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

const leftPaddle = {
  x: 20, // x position
  y: canvas.height / 2 - 25, // y position, centered on the canvas
  width: 10, // width
  height: 50, // height
  dy: 0, // change in y (used for movement)
};

const rightPaddle = {
  x: canvas.width - 30, // x position
  y: canvas.height / 2 - 25, // y position, centered on the canvas
  width: 10, // width
  height: 50, // height
  dy: 0, // change in y (used for movement)
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 6,
  dx: 6, // horizontal speed
  dy: -6, // vertical speed
};

document.addEventListener("keydown", (event) => {

  if (isTwoPlayerMode) {
    if (event.key === "w") leftPaddle.dy = -5;
    if (event.key === "s") leftPaddle.dy = 5;
}
  switch (event.code) {
    case "ArrowUp": // Arrow Up
      rightPaddle.dy = -5;
      break;
    case "ArrowDown": // Arrow Down
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

document.addEventListener('keydown', function(event) {
  if (!showMenu) return;

  if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      selectedOption = 1 - selectedOption; // Toggle between 0 and 1
      drawMenu(); // Redraw the menu with updated selection
  } else if (event.code === 'Enter') {
      startGame();
  }
});

document.addEventListener('keydown', function(event) {
  if(showMenu) return;

  if (event.code === 'Escape') {
    resetGame();
  }
});

canvas.addEventListener("click", function (event) {
  if (!showMenu) return;

  let rect = canvas.getBoundingClientRect();
  let clickY = event.clientY - rect.top;

  if (clickY > canvas.height / 2 - 10 && clickY < canvas.height / 2 + 40) {
    difficulty = "easy";
    startGame();
  } else if (
    clickY > canvas.height / 2 + 40 &&
    clickY < canvas.height / 2 + 90
  ) {
    difficulty = "medium";
    startGame();
  } else if (
    clickY > canvas.height / 2 + 90 &&
    clickY < canvas.height / 2 + 140
  ) {
    difficulty = "master";
    startGame();
  }
});

function drawField() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the midline
  ctx.beginPath();
  ctx.setLineDash([5, 15]); // Dashed line
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

function drawMenu() {
  if (!showMenu) return;

  // Draw the menu background
  ctx.fillStyle = "#008000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the title
  ctx.fillStyle = 'white';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`GRIFF'S PONG`, canvas.width / 2, canvas.height / 4);

  // Draw the options
  const options = ['1 Player', '2 Player'];
  ctx.font = '36px Arial';
  for (let i = 0; i < options.length; i++) {
      ctx.fillStyle = selectedOption === i ? 'yellow' : 'white';
      ctx.fillText(options[i], canvas.width / 2, canvas.height / 2 + 50 * i);
  }
}

function updateLeftPaddleAI() {
  if (isTwoPlayerMode) return;
  const middleOfPaddle = leftPaddle.y + leftPaddle.height / 2;
  if (middleOfPaddle < ball.y) {
    leftPaddle.y += 3; // Adjust speed as necessary
  } else if (middleOfPaddle > ball.y) {
    leftPaddle.y -= 3;
  }
}

function updatePaddles() {
  if (isTwoPlayerMode || !isTwoPlayerMode && leftPaddle.dy !== 0) {
    leftPaddle.y += leftPaddle.dy;
    // Boundary checks for left paddle...
}
  // Move right paddle
  rightPaddle.y += rightPaddle.dy;

  // Prevent the paddle from going out of the canvas
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  else if (rightPaddle.y + rightPaddle.height > canvas.height) {
    rightPaddle.y = canvas.height - rightPaddle.height;
  }

  updateLeftPaddleAI();

  // Prevent the left paddle from going out of the canvas
  if (leftPaddle.y < 0) leftPaddle.y = 0;
  else if (leftPaddle.y + leftPaddle.height > canvas.height) {
    leftPaddle.y = canvas.height - leftPaddle.height;
  }
}

function detectCollision(paddle, ball) {
  // Check if the ball is within the paddle's horizontal and vertical boundaries
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

function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Collision detection with top and bottom walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (detectCollision(leftPaddle, ball)) {
    ball.dx = -ball.dx;
    // Calculate hit position on paddle
    let collidePoint = ball.y - (leftPaddle.y + leftPaddle.height / 2);
    // Normalize the value
    collidePoint = collidePoint / (leftPaddle.height / 2);
    // Calculate the angle in Radian
    let angleRad = (collidePoint * Math.PI) / 4;
    // Change the Y direction of the ball
    ball.dy = ball.speed * Math.sin(angleRad);
  }

  if (detectCollision(rightPaddle, ball)) {
    ball.dx = -ball.dx;
    // Calculate hit position on paddle
    let collidePoint = ball.y - (rightPaddle.y + rightPaddle.height / 2);
    // Normalize the value
    collidePoint = collidePoint / (rightPaddle.height / 2);
    // Calculate the angle in Radian
    let angleRad = (collidePoint * Math.PI) / 4;
    // Change the Y direction of the ball
    ball.dy = ball.speed * Math.sin(angleRad);
  }

  // Check for scoring
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

function resetBall() {
  createFirework(ball.x, ball.y);

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  // Randomly set the ball's horizontal direction
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * 6;
  ball.dy = -6;
}

function startGame() {
  resetBall();
  showMenu = false;
  isTwoPlayerMode = (selectedOption === 1); 
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  showMenu = true;
}

function drawGame() {
  drawField();
  drawPaddle(leftPaddle);
  drawPaddle(rightPaddle);
  drawBall();
  drawScore();
}

function gameLoop() {
  if (showMenu) {
    drawMenu();
  } else {
    updatePaddles();
    updateBall();
    drawGame();
    handleParticles();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
