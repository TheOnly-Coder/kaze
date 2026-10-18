export async function main(ns) {
  const ram = parseInt(ns.args[0], 10);
  if (!ram) {
    ns.tprint("Purchased servers:");
    for (const s of ns.getPurchasedServers()) ns.tprint(s + " " + ns.getServerMaxRam(s) + "GB");
    ns.tprint("Usage: servers <ramGB> [name]");
    return;
  }
  const name = ns.args[1] || ("kaze-" + Date.now());
  const cost = ns.getPurchasedServerCost(ram);
  if (ns.getPlayer().money < cost) { ns.tprint("Not enough money. Cost: " + cost); return; }
  const host = ns.purchaseServer(name, ram);
  if (host) ns.tprint("Purchased " + host);
  else ns.tprint("Purchase failed.");
}
