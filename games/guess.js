import { readLine } from "/home/kaze/lib/common.js";

export async function main(ns) {
  ns.tprint("=== Guess the Number (1-100) ===");
  const target = 1 + Math.floor(Math.random() * 100);
  let tries = 0;
  while (true) {
    const g = await readLine(ns, "Your guess:");
    const n = parseInt(g, 10);
    if (!Number.isFinite(n)) { ns.tprint("Not a number."); continue; }
    tries++;
    if (n === target) { ns.tprint("Correct in " + tries + " tries!"); return; }
    if (n < target) ns.tprint("Higher.");
    else ns.tprint("Lower.");
  }
}
