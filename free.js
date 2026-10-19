export async function main(ns) {
  const visited = new Set();
  const stack = ["home"];
  const servers = [];
  while (stack.length) {
    const h = stack.pop();
    if (visited.has(h)) continue;
    visited.add(h);
    servers.push(h);
    try {
      for (const n of ns.scan(h)) {
        if (!visited.has(n)) stack.push(n);
      }
    } catch (e) {}
  }
  try {
    for (const s of ns.getPurchasedServers()) {
      if (!visited.has(s)) {
        visited.add(s);
        servers.push(s);
      }
    }
  } catch (e) {}

  let killed = 0;
  for (const host of servers) {
    let ps = [];
    try {
      ps = ns.ps(host);
    } catch (e) {
      ps = [];
    }
    for (const p of ps) {
      if (p.pid === ns.pid) continue;
      if (String(p.filename || "").toLowerCase().endsWith("kaze.js")) continue;
      try {
        if (ns.kill(p.pid)) {
          killed++;
          ns.tprint("killed " + p.filename + " (pid " + p.pid + ") on " + host);
        }
      } catch (e) {}
    }
  }
  ns.tprint("free: killed " + killed + " script(s).");
}
