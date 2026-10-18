/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

export async function main(ns) {
  let score = 0;
  let current = Math.floor(Math.random() * 13) + 1;
  while (true) {
    ns.tprint(`Current card: ${current}`);
    const raw = String(await readLine(ns, "higher or lower? (quit)")).trim().toLowerCase();
    if (raw === "quit" || raw === "q") break;
    const next = Math.floor(Math.random() * 13) + 1;
    let correct = false;
    if (raw === "higher" || raw === "h") correct = next > current;
    else if (raw === "lower" || raw === "l") correct = next < current;
    else { ns.tprint("Type higher/lower."); continue; }
    ns.tprint(`Next card: ${next} -> ${correct ? "Correct!" : "Wrong."}`);
    if (correct) score++;
    else { ns.tprint(`Game over. Score: ${score}`); break; }
    current = next;
  }
  ns.tprint(`Final score: ${score}`);
}
