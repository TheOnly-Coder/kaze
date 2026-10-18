export async function main(ns) {
  const target = ns.args[0];
  if (!target) {
    ns.tprint("Usage: nuke <host>");
    return;
  }
  const ports = [
    { fn: "BruteSSH.exe", call: () => ns.brutessh(target) },
    { fn: "FTPCrack.exe", call: () => ns.ftpcrack(target) },
    { fn: "relaySMTP.exe", call: () => ns.relaysmtp(target) },
    { fn: "HTTPWorm.exe", call: () => ns.httpworm(target) },
    { fn: "SQLInject.exe", call: () => ns.sqlinject(target) },
  ];
  for (const p of ports) {
    try { if (ns.fileExists(p.fn, "home")) p.call(); } catch (e) {}
  }
  try { ns.nuke(target); ns.tprint("Nuked " + target); }
  catch (e) { ns.tprint("Failed to nuke " + target + ": " + e); }
}
