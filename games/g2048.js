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
  let gained = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
      const merged = arr[i] * 2;
      out.push(merged);
      gained += merged;
      i++;
    } else out.push(arr[i]);
  }
  while (out.length < 4) out.push(0);
  return { row: out, gained };
}
function move(g, dir) {
  let changed = false;
  let gained = 0;
  if (dir === "left") for (let r = 0; r < 4; r++) { const s = slide(g[r]); if (s.row.join() !== g[r].join()) changed = true; gained += s.gained; g[r] = s.row; }
  if (dir === "right") for (let r = 0; r < 4; r++) { const s = slide(g[r].slice().reverse()); const n = s.row.reverse(); if (n.join() !== g[r].join()) changed = true; gained += s.gained; g[r] = n; }
  if (dir === "up") for (let c = 0; c < 4; c++) { const s = slide([g[0][c], g[1][c], g[2][c], g[3][c]]); for (let r = 0; r < 4; r++) { if (g[r][c] !== s.row[r]) changed = true; g[r][c] = s.row[r]; } gained += s.gained; }
  if (dir === "down") for (let c = 0; c < 4; c++) { const s = slide([g[0][c], g[1][c], g[2][c], g[3][c]].reverse()); const n = s.row.reverse(); for (let r = 0; r < 4; r++) { if (g[r][c] !== n[r]) changed = true; g[r][c] = n[r]; } gained += s.gained; }
  return { changed, gained };
}
function print(ns, g, score) {
  ns.tprint(`Score: ${score}`);
  for (const row of g) ns.tprint(row.map((x) => (x === 0 ? "." : x)).join("\t"));
}

export async function main(ns) {
  const g = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  let score = 0;
  addTile(g); addTile(g);
  while (true) {
    print(ns, g, score);
    if (g.some((r) => r.includes(2048))) { ns.tprint("You win!"); break; }
    if (!empty(g)) {
      // check moves
      let any = false;
      for (const d of ["left","right","up","down"]) { const copy = g.map((r) => r.slice()); if (move(copy, d).changed) { any = true; break; } }
      if (!any) { ns.tprint("Game over."); break; }
    }
    const raw = await readLine(ns, "Move (w/a/s/d or quit):");
    const m = String(raw).trim().toLowerCase();
    if (m === "quit" || m === "q") break;
    const dir = m === "w" ? "up" : m === "a" ? "left" : m === "s" ? "down" : m === "d" ? "right" : null;
    if (!dir) { ns.tprint("Use w/a/s/d."); continue; }
    const res = move(g, dir);
    if (!res.changed) { ns.tprint("No change."); continue; }
    score += res.gained;
    addTile(g);
  }
}
