export let showMenu = true;
export let selectedOption = 0;

export function drawMenu(ctx, canvas) {
  if (!showMenu) return;

  ctx.fillStyle = "#008000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`GRIFF'S PONG`, canvas.width / 2, canvas.height / 4);

  const options = ["1 Player", "2 Player"];
  ctx.font = "36px Arial";
  for (let i = 0; i < options.length; i++) {
    ctx.fillStyle = selectedOption === i ? "yellow" : "white";
    ctx.fillText(options[i], canvas.width / 2, canvas.height / 2 + 50 * i);
  }
}
