/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

export async function main(ns) {
  let credits = 1000;
  while (credits > 0) {
    ns.tprint(`Credits: ${credits}`);
    const betRaw = await readLine(ns, "Bet amount (or quit):");
    if (String(betRaw).trim().toLowerCase() === "quit") break;
    const bet = parseInt(String(betRaw).trim(), 10);
    if (!bet || bet < 1 || bet > credits) { ns.tprint("Invalid bet."); continue; }
    const choice = String(await readLine(ns, "Bet on red/black/green or number 0-36:")).trim().toLowerCase();
    credits -= bet;
    const spin = Math.floor(Math.random() * 37);
    const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const isRed = reds.includes(spin);
    const isBlack = spin !== 0 && !isRed;
    let win = false, mult = 0;
    if (choice === "red" && isRed) { win = true; mult = 2; }
    else if (choice === "black" && isBlack) { win = true; mult = 2; }
    else if (choice === "green" && spin === 0) { win = true; mult = 14; }
    else if (!isNaN(parseInt(choice, 10)) && parseInt(choice, 10) === spin) { win = true; mult = 36; }
    ns.tprint(`Spin: ${spin} (${spin === 0 ? "green" : isRed ? "red" : "black"})`);
    if (win) { const w = bet * mult; credits += w; ns.tprint(`WIN ${w}`); }
    else ns.tprint("Lose.");
  }
  ns.tprint(`Final credits: ${credits}`);
}
