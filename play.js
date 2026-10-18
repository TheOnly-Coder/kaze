import { readLine } from "/home/kaze/lib/common.js";

const GAMES = {
  guess: "guess.js",
  rps: "rps.js",
  hangman: "hangman.js",
  blackjack: "blackjack.js",
  slots: "slots.js",
  ttt: "tictactoe.js",
  tictactoe: "tictactoe.js",
  "2048": "g2048.js",
  g2048: "g2048.js",
  minesweeper: "minesweeper.js",
  snake: "snake.js",
  wordle: "wordle.js",
  higherlower: "higherlower.js",
  mathquiz: "mathquiz.js",
  roulette: "roulette.js",
  coinflip: "coinflip.js",
  quiz: "quiz.js",
  number: "number.js",
};

export async function main(ns) {
  const destRoot = "/home/kaze";
  let name = String(ns.args[0] || "").toLowerCase();
  if (!name) {
    ns.tprint("Available games: " + Object.keys(GAMES).filter((k, i, a) => a.indexOf(k) === i).join(", "));
    name = String(await readLine(ns, "Which game?")).toLowerCase();
  }
  const file = GAMES[name];
  if (!file) {
    ns.tprint("Unknown game: " + name);
    return;
  }
  const path = destRoot + "/games/" + file;
  const pid = ns.run(path);
  if (!pid) ns.tprint("Failed to start " + name + " (need RAM?)");
  else ns.tprint("Started " + name + " (pid " + pid + ")");
}
