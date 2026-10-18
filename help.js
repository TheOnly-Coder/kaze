export async function main(ns) {
  ns.tprint("=== Kaze Commands ===");
  const cmds = ["boot","setup","kaze","status","scan","nuke","hack","grow","weaken","hacknet","servers","stock","sleeves","gangs","blade","corp","contracts","auto","money","ram","ports","upgram","play <game>"];
  for (const c of cmds) ns.tprint("  " + c);
  ns.tprint("Games: guess, rps, tictactoe, hangman, quiz, number, blackjack, slots, snake, wordle, higherlower, mathquiz, minesweeper, 2048, roulette, coinflip");
}
