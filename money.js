export async function main(ns) {
  const p = ns.getPlayer();
  ns.tprint("Money: " + p.money);
  try { ns.tprint("Hacknet production: " + ns.hacknet.totalProduction().toFixed(2) + "/s"); } catch (e) {}
  try { ns.tprint("Hashes: " + ns.hacknet.numHashes()); } catch (e) {}
}
