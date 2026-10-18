import { readLine } from "/home/kaze/lib/common.js";

const QS = [
  { q: "2+2?", a: "4" },
  { q: "Capital of France?", a: "paris" },
  { q: "Bitburner language?", a: "javascript" },
  { q: "10*10?", a: "100" },
];

export async function main(ns) {
  ns.tprint("=== Quiz ===");
  let score = 0;
  for (const { q, a } of QS) {
    const ans = (await readLine(ns, q)).toLowerCase().trim();
    if (ans === a.toLowerCase()) { score++; ns.tprint("Correct."); }
    else ns.tprint("Wrong. Answer: " + a);
  }
  ns.tprint("Score: " + score + "/" + QS.length);
}
