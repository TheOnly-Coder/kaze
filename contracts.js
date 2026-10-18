export async function main(ns) {
  const servers = ["home"];
  const seen = new Set(["home"]);
  const q = ["home"];
  while (q.length) {
    const h = q.shift();
    for (const n of ns.scan(h)) if (!seen.has(n)) { seen.add(n); q.push(n); servers.push(n); }
  }
  let found = 0;
  for (const s of servers) {
    try {
      const files = ns.ls(s).filter(f => f.endsWith(".cct"));
      for (const f of files) { ns.tprint(s + "/" + f); found++; }
    } catch (e) {}
  }
  ns.tprint("Contracts found: " + found);
}
