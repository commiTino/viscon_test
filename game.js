// Stickman Run — a tiny jump & run. The whole game lives in this one file.
//
// Coordinates are in pixels: x grows to the right, y grows DOWNWARDS.
// Every object is a rectangle { x, y, w, h } where (x, y) is its top-left corner.

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width; // 960
const HEIGHT = canvas.height; // 540

// ---------------------------------------------------------------------------
// Tuning
// ---------------------------------------------------------------------------
const GRAVITY = 2000; // px/s²
const RUN_SPEED = 260; // px/s
const JUMP_SPEED = 720; // px/s
const MAX_FALL_SPEED = 1200; // px/s

// ---------------------------------------------------------------------------
// Level
// ---------------------------------------------------------------------------
const GROUND_Y = 460;

const level = {
  start: { x: 60, y: GROUND_Y - 56 },
  // Solid blocks the player can stand on and bump into.
  // Leave a gap between two platforms to make a hole.
  platforms: [{ x: 0, y: GROUND_Y, w: WIDTH, h: HEIGHT - GROUND_Y }],
  // Touch the door to win.
  door: { x: 860, y: GROUND_Y - 80, w: 50, h: 80 },
};

// ---------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------
const player = {
  x: 0,
  y: 0,
  w: 20,
  h: 56,
  vx: 0,
  vy: 0,
  onGround: false,
  facing: 1, // 1 = right, -1 = left
  animTime: 0,
};

let state = "playing"; // "playing" | "won"
let deaths = 0;
let deathFlash = 0; // seconds of red flash left after dying

function resetPlayer() {
  Object.assign(player, {
    x: level.start.x,
    y: level.start.y,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
  });
}

function die() {
  deaths++;
  deathFlash = 0.25;
  resetPlayer();
}

function win() {
  state = "won";
}

function restart() {
  deaths = 0;
  state = "playing";
  resetPlayer();
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
const keys = new Set();

addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
    e.preventDefault(); // don't scroll the page
  }
  keys.add(e.code);
  if (e.code === "KeyR") restart();
});
addEventListener("keyup", (e) => keys.delete(e.code));

const isDown = (...codes) => codes.some((code) => keys.has(code));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ---------------------------------------------------------------------------
// Update (called every frame, dt = seconds since last frame)
// ---------------------------------------------------------------------------
function update(dt) {
  deathFlash = Math.max(0, deathFlash - dt);
  if (state !== "playing") return;

  // Run & jump
  const dir = (isDown("ArrowRight", "KeyD") ? 1 : 0) - (isDown("ArrowLeft", "KeyA") ? 1 : 0);
  player.vx = dir * RUN_SPEED;
  if (dir !== 0) player.facing = dir;
  if (isDown("ArrowUp", "KeyW", "Space") && player.onGround) player.vy = -JUMP_SPEED;
  player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL_SPEED);

  // Move horizontally, then push out of any platform we ran into
  player.x += player.vx * dt;
  for (const p of level.platforms) {
    if (overlaps(player, p)) player.x = player.vx > 0 ? p.x - player.w : p.x + p.w;
  }
  player.x = clamp(player.x, 0, WIDTH - player.w);

  // Move vertically, then land on / bonk against platforms
  player.y += player.vy * dt;
  player.onGround = false;
  for (const p of level.platforms) {
    if (!overlaps(player, p)) continue;
    if (player.vy > 0) {
      player.y = p.y - player.h;
      player.onGround = true;
    } else {
      player.y = p.y + p.h;
    }
    player.vy = 0;
  }

  // Fell off the bottom of the screen
  if (player.y > HEIGHT) die();

  if (overlaps(player, level.door)) win();

  player.animTime += dt * (Math.abs(player.vx) / RUN_SPEED);
}

// ---------------------------------------------------------------------------
// Draw
// ---------------------------------------------------------------------------
function drawPlatforms() {
  for (const p of level.platforms) {
    ctx.fillStyle = "#5b4636";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(p.x, p.y, p.w, 8);
  }
}

function drawDoor() {
  const d = level.door;
  ctx.fillStyle = "#8d5524";
  ctx.fillRect(d.x, d.y, d.w, d.h);
  ctx.strokeStyle = "#5d3a1a";
  ctx.lineWidth = 4;
  ctx.strokeRect(d.x + 2, d.y + 2, d.w - 4, d.h - 4);
  ctx.fillStyle = "#ffd54f";
  ctx.beginPath();
  ctx.arc(d.x + d.w - 12, d.y + d.h / 2, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawStickman() {
  const cx = player.x + player.w / 2;
  const top = player.y;
  const moving = player.vx !== 0;

  // How far legs/arms swing out
  let swing = 6;
  if (!player.onGround) swing = 10;
  else if (moving) swing = Math.sin(player.animTime * 14) * 12;

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  // Head
  ctx.beginPath();
  ctx.arc(cx, top + 9, 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  // Body
  ctx.moveTo(cx, top + 17);
  ctx.lineTo(cx, top + 38);
  // Arms
  ctx.moveTo(cx - swing * 0.8, top + 34);
  ctx.lineTo(cx, top + 22);
  ctx.lineTo(cx + swing * 0.8, top + 34);
  // Legs
  ctx.moveTo(cx - swing, top + player.h);
  ctx.lineTo(cx, top + 38);
  ctx.lineTo(cx + swing, top + player.h);
  ctx.stroke();

  // Eye, so you can see where he's looking
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(cx + player.facing * 4, top + 8, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, x, y, size, align = "left") {
  ctx.fillStyle = "#222";
  ctx.font = `bold ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function draw() {
  // Sky
  ctx.fillStyle = "#cfe8ff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawPlatforms();
  drawDoor();
  drawStickman();

  drawText(`Deaths: ${deaths}`, 20, 36, 22);

  if (state === "won") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawText("You made it!", WIDTH / 2, HEIGHT / 2 - 10, 48, "center");
    drawText(`Deaths: ${deaths} · Press R to play again`, WIDTH / 2, HEIGHT / 2 + 34, 20, "center");
  }

  if (deathFlash > 0) {
    ctx.fillStyle = `rgba(255, 0, 0, ${deathFlash * 2})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------
let lastTime = performance.now();

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 1 / 30); // cap dt so lag spikes don't teleport us
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

resetPlayer();
requestAnimationFrame(loop);
