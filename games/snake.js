/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

export async function main(ns) {
  const W = 12, H = 12;
  let snake = [{ x: 5, y: 5 }];
  let dir = { x: 1, y: 0 };
  let food = { x: 8, y: 5 };
  let alive = true, score = 0;
  function placeFood() {
    const free = [];
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) {
      if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
    }
    if (!free.length) return;
    food = free[Math.floor(Math.random() * free.length)];
  }
  function draw() {
    const grid = Array.from({ length: H }, () => Array(W).fill(" "));
    grid[food.y][food.x] = "*";
    for (const s of snake) grid[s.y][s.x] = "O";
    grid[snake[0].y][snake[0].x] = "@";
    ns.tprint("+" + "-".repeat(W) + "+");
    for (const row of grid) ns.tprint("|" + row.join("") + "|");
    ns.tprint("+" + "-".repeat(W) + "+");
    ns.tprint(`Score: ${score}  (w/a/s/d, quit)`);
  }
  while (alive) {
    draw();
    const raw = String(await readLine(ns, "Move:")).trim().toLowerCase();
    if (raw === "quit" || raw === "q") break;
    const d = raw === "w" ? { x: 0, y: -1 } : raw === "s" ? { x: 0, y: 1 } : raw === "a" ? { x: -1, y: 0 } : raw === "d" ? { x: 1, y: 0 } : null;
    if (!d) { ns.tprint("Use w/a/s/d."); continue; }
    // prevent reverse
    if (d.x === -dir.x && d.y === -dir.y) continue;
    dir = d;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) { alive = false; break; }
    if (snake.some((s) => s.x === head.x && s.y === head.y)) { alive = false; break; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      if (snake.length === W * H) { ns.tprint("You win! Board cleared."); break; }
      placeFood();
    }
    else snake.pop();
  }
  ns.tprint(`Game over. Score: ${score}`);
}
