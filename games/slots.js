/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

const SYM = ["🍒", "🍋", "🔔", "⭐", "7️⃣", "💎"];

export async function main(ns) {
  let credits = 500;
  while (credits > 0) {
    ns.tprint(`Credits: ${credits}`);
    const raw = await readLine(ns, "Bet (or quit):");
    if (String(raw).trim().toLowerCase() === "quit") break;
    const bet = parseInt(String(raw).trim(), 10);
    if (!bet || bet < 1 || bet > credits) { ns.tprint("Invalid bet."); continue; }
    credits -= bet;
    const r = [SYM[Math.floor(Math.random()*SYM.length)], SYM[Math.floor(Math.random()*SYM.length)], SYM[Math.floor(Math.random()*SYM.length)]];
    ns.tprint(`[ ${r.join(" | ")} ]`);
    let mult = 0;
    if (r[0] === r[1] && r[1] === r[2]) mult = r[0] === "7️⃣" ? 10 : r[0] === "💎" ? 7 : 5;
    else if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) mult = 2;
    if (mult > 0) { const win = bet * mult; credits += win; ns.tprint(`WIN x${mult} = ${win}`); }
    else ns.tprint("No win.");
  }
  ns.tprint(`Final credits: ${credits}`);
}
