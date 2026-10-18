import { readLine, fmtMoney } from "/home/kaze/lib/common.js";

export async function main(ns) {
  const answer = await readLine(ns, "How many times to upgrade home RAM?");
  const n = parseInt(answer, 10);
  if (!Number.isFinite(n) || n <= 0) {
    ns.tprint("Cancelled: invalid number.");
    return;
  }
  const home = ns.getServer("home");
  const mult = (ns.getBitNodeMultipliers() || {}).HomeComputerRamCost || 1;
  const MAX = 1073741824;
  let ram = home.maxRam;
  let total = 0;
  const costs = [];
  for (let i = 0; i < n; i++) {
    if (ram >= MAX) break;
    const numUpgrades = Math.log2(ram);
    const m = Math.pow(1.58, numUpgrades);
    const cost = ram * 32000 * m * mult;
    costs.push(cost);
    total += cost;
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
    if (ns.getPlayer().money < c) {      ns.tprint("Not enough money for upgrade " + (i + 1) + ".");
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
