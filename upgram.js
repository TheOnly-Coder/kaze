import { readLine, fmtMoney } from "/home/kaze/lib/common.js";

export async function main(ns) {
  const answer = await readLine(ns, "How many times to upgrade home RAM?");
  const n = parseInt(answer, 10);
  if (!Number.isFinite(n) || n <= 0) {
    ns.tprint("Cancelled: invalid number.");
    return;
  }
  let firstCost;
  try { firstCost = ns.singularity.getUpgradeHomeRamCost(); }
  catch (e) { ns.tprint("This script needs the Singularity API (Source-File 4 or BitNode-4)."); return; }
  const home = ns.getServer("home");
  const MAX = 1073741824;
  // Cost formula: ram * 32000 * 1.58^log2(ram) * mult. Each doubled upgrade
  // multiplies the cost by exactly 2 * 1.58 (the live cost is re-checked below).
  const GROWTH = 2 * 1.58;
  let ram = home.maxRam;
  let total = 0;
  let cost = firstCost;
  const costs = [];
  for (let i = 0; i < n; i++) {
    if (ram >= MAX) break;
    costs.push(cost);
    total += cost;
    cost *= GROWTH;
    ram *= 2;
  }
  if (costs.length === 0) {
    ns.tprint("Home RAM already at maximum.");
    return;
  }
  ns.tprint("Upgrading home RAM " + costs.length + " time(s).");
  ns.tprint("Total cost: " + fmtMoney(total));
  for (let i = 0; i < costs.length; i++) {
    ns.tprint("  " + (i + 1) + ": " + fmtMoney(costs[i]));
  }
  const confirm = await readLine(ns, "Confirm? (y/n)");
  if (String(confirm).toLowerCase() !== "y") {
    ns.tprint("Cancelled.");
    return;
  }
  for (let i = 0; i < costs.length; i++) {
    const c = ns.singularity.getUpgradeHomeRamCost();
    if (ns.getPlayer().money < c) {
      ns.tprint("Not enough money for upgrade " + (i + 1) + ".");
      return;
    }
    const ok = ns.singularity.upgradeHomeRam();
    if (!ok) {
      ns.tprint("Upgrade " + (i + 1) + " failed.");
      return;
    }
    ns.tprint("Upgraded " + (i + 1) + "/" + costs.length + " (" + fmtMoney(c) + ")");
    await ns.sleep(200);
  }
  ns.tprint("Done. Home RAM now " + ns.getServer("home").maxRam + "GB.");
}
