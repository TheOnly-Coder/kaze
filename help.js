export async function main(ns) {
  ns.tprint("=== Kaze Commands ===");
  const cmds = ["boot","setup","kaze","status","scan","nuke","hack","grow","weaken","hacknet","servers","stock","sleeves","gangs","blade","corp","contracts","auto","money","ram","ports","upgram","update","del <path>","play <game>","search <query>","browse <url>","web <query> <url>","browser","free","apt install <repo>","sudo apt install <repo>","git clone <repo>","ls","cat","pwd","grep","ps","top","kill","clear"];
  for (const c of cmds) ns.tprint("  " + c);
  ns.tprint("update refreshes Kaze from the repo (only changed/new files). del force-deletes files or whole folders.");
  ns.tprint("Linux-style commands and aliases are available: ls, ll, cat, pwd, echo, touch, mkdir, rm, cp, mv, head, tail, wc, grep, find, ps, top, kill, killall, whoami, hostname, uname, date, clear, curl, wget, sort, uniq, cut, tr, free, mem, df, du, git, apt, sudo.");
  ns.tprint("Games: guess, rps, tictactoe, hangman, quiz, number, blackjack, slots, snake, wordle, higherlower, mathquiz, minesweeper, 2048, roulette, coinflip");
  ns.tprint("Integrated Bitburner scripts: bb-daemon, bb-autopilot, sscan, facman, work, crime, ascend, hashes, do, hostman, stockmaster, stanek, etc.");
  ns.tprint("Launch a game with 'play <game>' or type its name directly (e.g. '2048').");
}
