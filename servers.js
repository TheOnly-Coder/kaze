export async function main(ns) {
  const ram = parseInt(ns.args[0], 10);
  if (!ram) {
    const servers = ns.cloud.getServerNames();
    ns.tprint("Cloud servers (" + servers.length + "/" + ns.cloud.getServerLimit() + "):");
    for (const s of servers) ns.tprint("  " + s + "  " + ns.getServerMaxRam(s) + "GB");
    ns.tprint("Usage: servers <ramGB> [name]");
    return;
  }
  const cost = ns.cloud.getServerCost(ram);
  if (!Number.isFinite(cost)) { ns.tprint("Invalid RAM amount: " + ram); return; }
  if (ns.getPlayer().money < cost) { ns.tprint("Not enough money. Cost: " + cost); return; }
  const name = String(ns.args[1] || ("kaze-" + Date.now()));
  const host = ns.cloud.purchaseServer(name, ram);
  if (host) ns.tprint("Purchased " + host + " (" + ram + "GB) for " + cost);
  else ns.tprint("Purchase failed. Server limit: " + ns.cloud.getServerLimit() + ", max RAM: " + ns.cloud.getRamLimit() + "GB.");
}
