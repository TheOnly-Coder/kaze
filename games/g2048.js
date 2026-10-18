/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

function empty(g) { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] === 0) return true; return false; }
function addTile(g) {
  const cells = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] === 0) cells.push([r, c]);
  if (!cells.length) return;
  const [r, c] = cells[Math.floor(Math.random() * cells.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
}
function slide(row) {
  const arr = row.filter((x) => x !== 0);
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (i + 1 < arr.length && arr[i] === arr[i + 1]) { out.push(arr[i] * 2); i++; }
    else out.push(arr[i]);
  }
  while (out.length < 4) out.push(0);
  return out;
}
function move(g, dir) {
  let changed = false;
  if (dir === "left") for (let r = 0; r < 4; r++) { const n = slide(g[r]); if (n.join() !== g[r].join()) changed = true; g[r] = n; }
  if (dir === "right") for (let r = 0; r < 4; r++) { const n = slide(g[r].slice().reverse()).reverse(); if (n.join() !== g[r].join()) changed = true; g[r] = n; }
  if (dir === "up") for (let c = 0; c < 4; c++) { const col = [g[0][c], g[1][c], g[2][c], g[3][c]]; const n = slide(col); for (let r = 0; r < 4; r++) { if (g[r][c] !== n[r]) changed = true; g[r][c] = n[r]; } }
  if (dir === "down") for (let c = 0; c < 4; c++) { const col = [g[0][c], g[1][c], g[2][c], g[3][c]].reverse(); const n = slide(col).reverse(); for (let r = 0; r < 4; r++) { if (g[r][c] !== n[r]) changed = true; g[r][c] = n[r]; } }
  return changed;
}
function print(g, score) {
  ns.tprint(`Score: ${score}`);
  for (const row of g) ns.tprint(row.map((x) => (x === 0 ? "." : x)).join("\t"));
}

export async function main(ns) {
  const g = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  let score = 0;
  addTile(g); addTile(g);
  while (true) {
    print(g, score);
    if (g.some((r) => r.includes(2048))) { ns.tprint("You win!"); break; }
    if (!empty(g)) {
      // check moves
      let any = false;
      for (const d of ["left","right","up","down"]) { const copy = g.map((r) => r.slice()); if (move(copy, d)) { any = true; break; } }
      if (!any) { ns.tprint("Game over."); break; }
    }
    const raw = await readLine(ns, "Move (w/a/s/d or quit):");
    const m = String(raw).trim().toLowerCase();
    if (m === "quit" || m === "q") break;
    const dir = m === "w" ? "up" : m === "a" ? "left" : m === "s" ? "down" : m === "d" ? "right" : null;
    if (!dir) { ns.tprint("Use w/a/s/d."); continue; }
    // score delta
    const before = g.map((r) => r.slice());
    if (!move(g, dir)) { ns.tprint("No change."); continue; }
    // add score for merges (approx)
    let delta = 0;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] > (before[r][c] || 0) && before[r][c] !== 0) delta += g[r][c] - before[r][c];
    score += delta;
    addTile(g);
  }
}
