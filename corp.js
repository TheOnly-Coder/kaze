export async function main(ns) {
  if (!ns.corporation || !ns.corporation.hasCorporation()) { ns.tprint("No corporation."); return; }
  const c = ns.corporation.getCorporation();
  ns.tprint("Corp: " + c.name + "  funds:" + Math.floor(c.funds) + "  revenue:" + Math.floor(c.revenue));
  ns.tprint("Divisions: " + ns.corporation.getDivisionNames().join(", "));
}
