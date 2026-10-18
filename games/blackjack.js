/** @param {NS} ns */
import { readLine, confirm } from "/home/kaze/lib/common.js";

function val(card) { if (card === 1) return 11; if (card >= 10) return 10; return card; }
function handValue(hand) {
  let total = 0, aces = 0;
  for (const c of hand) { if (c === 1) { aces++; total += 11; } else total += (c >= 10 ? 10 : c); }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}
function draw(deck) { return deck.splice(Math.floor(Math.random() * deck.length), 1)[0]; }
function newDeck() {
  const d = [];
  for (let i = 0; i < 4; i++) for (let v = 1; v <= 13; v++) d.push(v);
  return d;
}
const name = (c) => (c === 1 ? "A" : c === 11 ? "J" : c === 12 ? "Q" : c === 13 ? "K" : String(c));

export async function main(ns) {
  let chips = 1000;
  while (chips > 0) {
    ns.tprint(`Chips: ${chips}`);
    const betRaw = await readLine(ns, "Bet (or quit):");
    const bet = parseInt(String(betRaw).trim(), 10);
    if (String(betRaw).trim().toLowerCase() === "quit") break;
    if (!bet || bet < 1 || bet > chips) { ns.tprint("Invalid bet."); continue; }
    const deck = newDeck();
    const player = [draw(deck), draw(deck)];
    const dealer = [draw(deck), draw(deck)];
    ns.tprint(`You: ${player.map(name).join(" ")} = ${handValue(player)}`);
    ns.tprint(`Dealer: ${name(dealer[0])} ?`);
    // player turn
    let bust = false;
    while (true) {
      const v = handValue(player);
      if (v >= 21) break;
      const a = await readLine(ns, "hit or stand?");
      const act = String(a).trim().toLowerCase();
      if (act === "hit" || act === "h") { player.push(draw(deck)); ns.tprint(`You: ${player.map(name).join(" ")} = ${handValue(player)}`); if (handValue(player) > 21) { bust = true; break; } }
      else break;
    }
    if (bust) { ns.tprint("Bust! You lose."); chips -= bet; continue; }
    // dealer turn
    while (handValue(dealer) < 17) dealer.push(draw(deck));
    const pv = handValue(player), dv = handValue(dealer);
    ns.tprint(`Dealer: ${dealer.map(name).join(" ")} = ${dv}`);
    if (dv > 21 || pv > dv) { ns.tprint("You win!"); chips += bet; }
    else if (pv === dv) { ns.tprint("Push."); }
    else { ns.tprint("Dealer wins."); chips -= bet; }
  }
  ns.tprint(`Final chips: ${chips}`);
}
