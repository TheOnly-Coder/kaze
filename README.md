# Kaze OS for Bitburner

A terminal-first operating system layer for Bitburner. Everything runs in the terminal: no popups, no text boxes.

## Install
1. Put all files on your `home` server (root) via Remote API or `wget`.
2. Run `run setup.js`.
3. Setup moves everything into `/home/kaze` and creates aliases.
4. Type `boot`.

## Aliases
boot, setup, upgram, play, kazehelp, status, money, servers, hacknet, autohack, stock, gang, sleeve, blade, kazever

## upgram
Asks how many times to upgrade home RAM, prints per-step and total cost, asks `y` to confirm.

## play
`play <game>` launches a minigame. Games: guess rps hangman blackjack slots ttt 2048 minesweeper snake wordle higherlower mathquiz roulette coinflip.

## Notes
All input is read from the terminal input field; no `ns.prompt` dialogs are used.
