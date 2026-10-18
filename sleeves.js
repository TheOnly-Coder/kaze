export async function main(ns) {
  let count;
  try { count = ns.sleeve.getNumSleeves(); }
  catch (e) { ns.tprint("Sleeve API unavailable (needs Source-File 10 or BitNode-10)."); return; }
  ns.tprint("Sleeves: " + count);
  for (let i = 0; i < count; i++) {
    const info = ns.sleeve.getSleeve(i);
    ns.tprint("Sleeve " + i + ": " + info.city + "  sync:" + info.sync + "  shock:" + info.shock);
  }
}
