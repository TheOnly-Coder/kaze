export async function main(ns) {
  const seen = new Set(["home"]);
  const q = ["home"];
  const all = [];
  while (q.length) {
    const h = q.shift();
    all.push(h);
    for (const n of ns.scan(h)) if (!seen.has(n)) { seen.add(n); q.push(n); }
  }
  for (const s of all) {
    if (s === "home") continue;
    try {
      const srv = ns.getServer(s);
      if (srv.hasAdminRights) continue;
      const ports = ["BruteSSH.exe","FTPCrack.exe","relaySMTP.exe","HTTPWorm.exe","SQLInject.exe"];
      for (const p of ports) if (ns.fileExists(p, "home")) {
        if (p === "BruteSSH.exe") ns.brutessh(s);
        if (p === "FTPCrack.exe") ns.ftpcrack(s);
        if (p === "relaySMTP.exe") ns.relaysmtp(s);
        if (p === "HTTPWorm.exe") ns.httpworm(s);
        if (p === "SQLInject.exe") ns.sqlinject(s);
      }
      ns.nuke(s);
      ns.tprint("Nuked " + s);
    } catch (e) {}
  }
  ns.tprint("Auto nuke complete.");
}
