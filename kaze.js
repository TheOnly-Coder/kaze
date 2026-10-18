import { printLogo, fmtMoney } from "/home/kaze/lib/common.js";

export async function main(ns) {
  await printLogo(ns);
  ns.tprint("");
  const p = ns.getPlayer();
  const home = ns.getServer("home");
  ns.tprint("=== Kaze OS Dashboard ===");
  ns.tprint("Player: " + p.name + "  Hack: " + p.skills.hacking + "  Money: " + fmtMoney(p.money));
  ns.tprint("Home RAM: " + home.maxRam + "GB  Used: " + home.ramUsed + "GB");
  ns.tprint("Karma: " + p.karma + "  City: " + p.city);
  ns.tprint("Scripts: " + ns.ls("home").length + " files on home");  ns.tprint("");
  ns.tprint("Quick commands: status, scan, hacknet, play <game>, upgram");
}
