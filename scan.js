export async function main(ns) {
  const depth = parseInt(ns.args[0], 10) || 1;
  const servers = new Set();
  const queue = [["home", 0]];
  const seen = new Set(["home"]);
  while (queue.length) {
    const [host, d] = queue.shift();
    if (d > depth) continue;
    servers.add(host);
    for (const n of ns.scan(host)) {
      if (!seen.has(n)) { seen.add(n); queue.push([n, d + 1]); }
    }
  }
  ns.tprint("=== Scan (depth " + depth + ") ===");
  for (const s of [...servers].sort()) {
    const srv = ns.getServer(s);
    ns.tprint(s + "  hack:" + srv.requiredHackingSkill + "  ram:" + srv.maxRam + "GB  root:" + srv.hasAdminRights + "  money:" + Math.floor(srv.moneyAvailable));
  }
}
