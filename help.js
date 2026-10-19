export async function main(ns) {
  ns.tprint("=== Kaze Commands ===");
  const cmds = ["boot","setup","kaze","status","scan","nuke","hack","grow","weaken","hacknet","servers","stock","sleeves","gangs","blade","corp","contracts","auto","money","ram","ports","upgram","update","del <path>","play <game>","search <query>","browse <url>","web <query> <url>","browser"];
  for (const c of cmds) ns.tprint("  " + c);
  ns.tprint("update refreshes Kaze from the repo (only changed/new files). del force-deletes files or whole folders.");
  ns.tprint("Games: guess, rps, tictactoe, hangman, quiz, number, blackjack, slots, snake, wordle, higherlower, mathquiz, minesweeper, 2048, roulette, coinflip");
  ns.tprint("Launch a game with 'play <game>' or type its name directly (e.g. '2048').");
}
