export async function main(ns) {
  const money = ns.getPlayer().money;
  let bought = false;
  if (ns.hacknet.numNodes() === 0) {
    const cost = ns.hacknet.getPurchaseNodeCost();
    if (money >= cost) { ns.hacknet.purchaseNode(); bought = true; ns.tprint("Purchased node 0 for " + cost); }
  }
  const n = ns.hacknet.numNodes();
  for (let i = 0; i < n; i++) {
    const lc = ns.hacknet.getLevelUpgradeCost(i, 1);
    const rc = ns.hacknet.getRamUpgradeCost(i, 1);
    const cc = ns.hacknet.getCoreUpgradeCost(i, 1);
    const best = Math.min(lc, rc, cc);
    if (best === lc && ns.getPlayer().money >= lc) { ns.hacknet.upgradeLevel(i, 1); ns.tprint("Node " + i + " level up"); }
    else if (best === rc && ns.getPlayer().money >= rc) { ns.hacknet.upgradeRam(i, 1); ns.tprint("Node " + i + " ram up"); }
    else if (best === cc && ns.getPlayer().money >= cc) { ns.hacknet.upgradeCore(i, 1); ns.tprint("Node " + i + " core up"); }
  }
  if (!bought && n === 0) ns.tprint("Not enough money to buy node.");
  ns.tprint("Hacknet nodes: " + n);
}
