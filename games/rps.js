import { readLine } from "/home/kaze/lib/common.js";

const CHOICES = ["rock", "paper", "scissors"];

export async function main(ns) {
  ns.tprint("=== Rock Paper Scissors ===");
  ns.tprint("Type rock/paper/scissors. 'quit' to exit.");
  let wins = 0, losses = 0, draws = 0;
  while (true) {
    const c = (await readLine(ns, "Your move:")).toLowerCase();
    if (c === "quit") break;
    if (!CHOICES.includes(c)) { ns.tprint("Invalid."); continue; }
    const cpu = CHOICES[Math.floor(Math.random() * 3)];
    ns.tprint("CPU chose " + cpu);
    if (c === cpu) { draws++; ns.tprint("Draw."); }
    else if ((c === "rock" && cpu === "scissors") || (c === "paper" && cpu === "rock") || (c === "scissors" && cpu === "paper")) { wins++; ns.tprint("You win."); }
    else { losses++; ns.tprint("You lose."); }
  }
  ns.tprint("W:" + wins + " L:" + losses + " D:" + draws);
}
