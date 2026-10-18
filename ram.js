export async function main(ns) {
  const home = ns.getServer("home");
  ns.tprint("Home RAM: " + home.ramUsed + " / " + home.maxRam + " GB");
  const procs = ns.ps("home");
  for (const p of procs) ns.tprint("  " + p.filename + "  threads:" + p.threads + "  ram:" + (ns.getScriptRam(p.filename, "home") * p.threads).toFixed(2) + "GB");
}
