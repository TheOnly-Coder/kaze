export async function main(ns) {
  if (!ns.sleeve) { ns.tprint("Sleeve API unavailable (need SF9)."); return; }
  const count = ns.sleeve.getNumSleeves();
  ns.tprint("Sleeves: " + count);
  for (let i = 0; i < count; i++) {
    const info = ns.sleeve.getSleeve(i);
    ns.tprint("Sleeve " + i + ": " + info.city + "  sync:" + info.sync + "  shock:" + info.shock);
  }
}
