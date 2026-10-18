/** @param {NS} ns */
import { readLine } from "/home/kaze/lib/common.js";

export async function main(ns) {
  let credits = 500;
  while (credits > 0) {
    ns.tprint(`Credits: ${credits}`);
    const betRaw = await readLine(ns, "Bet (or quit):");
    if (String(betRaw).trim().toLowerCase() === "quit") break;
    const bet = parseInt(String(betRaw).trim(), 10);
    if (!bet || bet < 1 || bet > credits) { ns.tprint("Invalid bet."); continue; }
    let choice = String(await readLine(ns, "heads or tails:")).trim().toLowerCase();
    if (choice === "h") choice = "heads";
    if (choice === "t") choice = "tails";
    if (choice !== "heads" && choice !== "tails") { ns.tprint("Type heads or tails."); continue; }
    credits -= bet;
    const flip = Math.random() < 0.5 ? "heads" : "tails";
    ns.tprint(`Flip: ${flip}`);
    if (choice === flip) { credits += bet * 2; ns.tprint("WIN"); }
    else ns.tprint("Lose.");
  }
  ns.tprint(`Final credits: ${credits}`);
}
