import { readLine } from "/home/kaze/lib/common.js";

const WORDS = ["kaze", "bitburner", "netscript", "terminal", "augment", "daemon"];

export async function main(ns) {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  let guessed = new Set();
  let wrong = 0;
  const maxWrong = 6;
  function display() {
    let s = "";
    for (const ch of word) s += guessed.has(ch) ? ch + " " : "_ ";
    return s.trim();
  }
  ns.tprint("=== Hangman ===");
  while (wrong < maxWrong && display().includes("_")) {
    ns.tprint(display() + "   wrong: " + wrong + "/" + maxWrong);
    const g = (await readLine(ns, "Letter:")).toLowerCase();
    if (!g || g.length !== 1 || !/[a-z]/.test(g)) { ns.tprint("One letter."); continue; }
    if (guessed.has(g)) { ns.tprint("Already guessed."); continue; }
    guessed.add(g);
    if (!word.includes(g)) { wrong++; ns.tprint("Nope."); }
    else ns.tprint("Yes.");
  }
  if (!display().includes("_")) ns.tprint("You win! Word: " + word);
  else ns.tprint("You lose. Word: " + word);
}
