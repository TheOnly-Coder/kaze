/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

export async function main(ns) {
  let score = 0, total = 0;
  while (true) {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans = 0;
    if (op === "+") ans = a + b;
    if (op === "-") ans = a - b;
    if (op === "*") ans = a * b;
    const raw = await readLine(ns, `${a} ${op} ${b} = ? (quit to stop)`);
    if (String(raw).trim().toLowerCase() === "quit") break;
    total++;
    if (parseInt(String(raw).trim(), 10) === ans) { score++; ns.tprint("Correct!"); }
    else ns.tprint(`Wrong. Answer: ${ans}`);
  }
  ns.tprint(`Score: ${score}/${total}`);
}
