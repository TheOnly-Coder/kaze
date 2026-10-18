# Kaze OS for Bitburner

A terminal-first operating system layer for Bitburner. Everything runs in the terminal: no popups, no text boxes.

## Install
1. Make a file called installer.js containing what is in installer.js and run it
2. Run `run setup.js`.
3. Setup moves everything into `/home/kaze` and creates aliases.
4. Type `boot`.

## Aliases
boot, setup, upgram, play, kazehelp, status, money, servers, hacknet, autohack, stock, gang, sleeve, blade, kazever, update, del

## Uploading a new version (kaze.sh)
Run from the cloned folder on your computer (the sh script never runs in game):
- `./kaze.sh` — asks for a commit message, commits all changes and pushes to the repo.
- `./kaze.sh "message"` — same, without the prompt.

## In-game update
`update` checks the repo and downloads only the files that changed or are new; untouched files are left alone. `update prune` also deletes local Kaze files that were removed from the repo.
`del <file|folder>` is the force-delete command (like `rm -rf`): `del games` removes every file under games.

## upgram
Asks how many times to upgrade home RAM, prints per-step and total cost, asks `y` to confirm.

## play
`play <game>` launches a minigame. Games: guess rps hangman blackjack slots ttt 2048 minesweeper snake wordle higherlower mathquiz roulette coinflip. Each game also has its own alias (e.g. `2048` or `snake`).

## Notes
All input is read from the terminal input field; no `ns.prompt` dialogs are used.
