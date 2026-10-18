export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  ns.tprint("Growing " + target + "...");
  while (true) {
    await ns.grow(target);
    await ns.sleep(100);
  }
}
