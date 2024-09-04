export const ball = {
  x: 400,
  y: 200,
  radius: 7,
  speed: 6,
  dx: 6, // horizontal speed
  dy: -6, // vertical speed
};

export function resetBall() {
  ball.x = 400;
  ball.y = 200;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * 6;
  ball.dy = -6;
}
