export async function main(ns) {
  const p = ns.getPlayer();
  ns.tprint("Money: " + p.money);
  try {
    let production = 0;
    for (let i = 0; i < ns.hacknet.numNodes(); i++) production += ns.hacknet.getNodeStats(i).production;
    ns.tprint("Hacknet production: " + production.toFixed(2) + "/s");
  } catch (e) {}
  try { ns.tprint("Hashes: " + ns.hacknet.numHashes()); } catch (e) {}
}
