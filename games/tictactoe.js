import { readLine } from "/home/kaze/lib/common.js";

function printBoard(b) {
  for (let i = 0; i < 9; i += 3) {
    console.log? 0 : 0;
  }
}

export async function main(ns) {
  ns.tprint("=== Tic-Tac-Toe (you=X, cpu=O) ===");
  let b = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function winner() {
    for (const [a,cc,d] of wins) if (b[a] !== " " && b[a] === b[cc] && b[a] === b[d]) return b[a];
    if (b.every(x => x !== " ")) return "D";
    return null;
  }
  function show() {
    ns.tprint(b[0] + "|" + b[1] + "|" + b[2]);
    ns.tprint("-+-+-");
    ns.tprint(b[3] + "|" + b[4] + "|" + b[5]);
    ns.tprint("-+-+-");
    ns.tprint(b[6] + "|" + b[7] + "|" + b[8]);
  }
  while (true) {
    show();
    const w = winner();
    if (w) { ns.tprint(w === "D" ? "Draw." : w + " wins."); return; }
    const pos = await readLine(ns, "Position 1-9:");
    const i = parseInt(pos, 10) - 1;
    if (!Number.isFinite(i) || i < 0 || i > 8 || b[i] !== " ") { ns.tprint("Invalid."); continue; }
    b[i] = "X";
    const w2 = winner();
    if (w2) { show(); ns.tprint(w2 === "D" ? "Draw." : w2 + " wins."); return; }
    const free = b.map((v, idx) => v === " " ? idx : -1).filter(v => v >= 0);
    if (free.length) b[free[Math.floor(Math.random() * free.length)]] = "O";
  }
}
