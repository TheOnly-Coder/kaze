import { readLine } from "/home/kaze/lib/common.js";

export async function main(ns) {
  ns.tprint("=== Even or Odd ===");
  let score = 0;
  for (let i = 0; i < 10; i++) {
    const n = Math.floor(Math.random() * 1000);
    const ans = (await readLine(ns, n + " even or odd?")).toLowerCase().trim();
    const correct = (n % 2 === 0) ? "even" : "odd";
    if (ans === correct) { score++; ns.tprint("Correct."); }
    else ns.tprint("Wrong. It was " + correct + ".");
  }
  ns.tprint("Score: " + score + "/10");
}
