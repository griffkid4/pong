export class Particle {
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
