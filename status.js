import { fmtMoney } from "/home/kaze/lib/common.js";

export async function main(ns) {
  const p = ns.getPlayer();
  const home = ns.getServer("home");
  ns.tprint("=== Kaze Status ===");
  ns.tprint("Name: " + p.name);
  ns.tprint("Money: " + fmtMoney(p.money));
  ns.tprint("Hack: " + p.skills.hacking + "  Str: " + p.skills.strength + "  Def: " + p.skills.defense + "  Dex: " + p.skills.dexterity + "  Agi: " + p.skills.agility);
  ns.tprint("Cha: " + p.skills.charisma + "  Int: " + p.skills.intelligence);
  ns.tprint("Home RAM: " + home.maxRam + "GB / " + home.ramUsed + "GB used");
  ns.tprint("Home Cores: " + home.cpuCores);
  ns.tprint("Karma: " + p.karma + "  City: " + p.city);
  ns.tprint("Running scripts: " + ns.ps("home").length);
}
