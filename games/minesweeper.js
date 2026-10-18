/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

export async function main(ns) {
  const SIZE = 6, MINES = 6;
  // build
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  const revealed = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const flagged = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  // place mines
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
    if (grid[r][c] !== -1) { grid[r][c] = -1; placed++; }
  }
  // numbers
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (grid[r][c] === -1) continue;
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid[nr][nc] === -1) n++;
    }
    grid[r][c] = n;
  }
  function reveal(r, c) {
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || revealed[r][c] || flagged[r][c]) return;
    revealed[r][c] = true;
    if (grid[r][c] === 0) {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) reveal(r + dr, c + dc);
    }
  }
  function print() {
    ns.tprint("   " + Array.from({ length: SIZE }, (_, i) => i).join(" "));
    for (let r = 0; r < SIZE; r++) {
      const row = [];
      for (let c = 0; c < SIZE; c++) {
        if (flagged[r][c]) row.push("F");
        else if (!revealed[r][c]) row.push("#");
        else if (grid[r][c] === -1) row.push("*");
        else row.push(grid[r][c] === 0 ? "." : String(grid[r][c]));
      }
      ns.tprint(r + "  " + row.join(" "));
    }
  }
  while (true) {
    print();
    const raw = await readLine(ns, "r c (reveal) or f c (flag) or quit:");
    const parts = String(raw).trim().split(/\s+/);
    if (parts[0] === "quit" || parts[0] === "q") break;
    if (parts.length < 2) { ns.tprint("Usage: r 2 3  or  f 2 3"); continue; }
    const mode = parts[0];
    const r = parseInt(parts[1], 10), c = parseInt(parts[2], 10);
    if (isNaN(r) || isNaN(c) || r < 0 || r >= SIZE || c < 0 || c >= SIZE) { ns.tprint("Bad coords."); continue; }
    if (mode === "f") { flagged[r][c] = !flagged[r][c]; continue; }
    if (flagged[r][c]) { ns.tprint("Flagged."); continue; }
    if (grid[r][c] === -1) { // mine
      // reveal all
      for (let rr = 0; rr < SIZE; rr++) for (let cc = 0; cc < SIZE; cc++) revealed[rr][cc] = true;
      print();
      ns.tprint("BOOM! You hit a mine.");
      break;
    }
    reveal(r, c);
    // check win: all non-mines revealed
    let remaining = 0;
    for (let rr = 0; rr < SIZE; rr++) for (let cc = 0; cc < SIZE; cc++) if (grid[rr][cc] !== -1 && !revealed[rr][cc]) remaining++;
    if (remaining === 0) { print(); ns.tprint("You win!"); break; }
  }
  if (!(await confirm(ns, "Play again?"))) return;
  // restart by re-running
  ns.run(ns.getScriptName(), 1);
}
