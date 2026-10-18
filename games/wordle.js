/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

const WORDS = ["kaze", "crane", "slate", "trace", "crate", "audio", "raise", "arise", "irate", "stare", "store", "shore", "snare", "share", "spare", "spire", "spite", "spine", "spice", "slice", "slime"];
const FIVE = WORDS.filter((w) => w.length === 5);

export async function main(ns) {
  while (true) {
    const target = FIVE[Math.floor(Math.random() * FIVE.length)];
    let guesses = 0, won = false;
    while (guesses < 6) {
      const g = String(await readLine(ns, `Guess ${guesses + 1}/6:`)).trim().toLowerCase();
      if (g.length !== 5) { ns.tprint("5 letters."); continue; }
      guesses++;
      // feedback
      const res = Array(5).fill("⬜");
      const tArr = target.split("");
      const gArr = g.split("");
      for (let i = 0; i < 5; i++) if (gArr[i] === tArr[i]) { res[i] = "🟩"; tArr[i] = null; gArr[i] = null; }
      for (let i = 0; i < 5; i++) {
        if (gArr[i] === null) continue;
        const idx = tArr.indexOf(gArr[i]);
        if (idx !== -1) { res[i] = "🟨"; tArr[idx] = null; }
      }
      ns.tprint(g + "  " + res.join(""));
      if (g === target) { won = true; break; }
    }
    if (won) ns.tprint("You win! Word: " + target);
    else ns.tprint("You lose. Word: " + target);
    if (!(await confirm(ns, "Play again?"))) break;
  }
}
