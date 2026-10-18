export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  ns.tprint("Weakening " + target + "...");
  while (true) {
    await ns.weaken(target);
    await ns.sleep(100);
  }
}
