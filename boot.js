import { printLogo } from "/home/kaze/lib/common.js";

export async function main(ns) {
  await printLogo(ns);
  ns.tprint("");
  ns.tprint("Kaze OS booted.");
  ns.tprint("Type 'kaze' for the dashboard, 'kazehelp' for commands.");
}
