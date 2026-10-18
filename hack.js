export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  if (!ns.hasRootAccess(target)) {
    ns.tprint("No root on " + target + ". Run nuke " + target);
    return;
  }
  ns.tprint("Hacking " + target + "...");
  while (true) {
    await ns.hack(target);
    await ns.sleep(100);
  }
}
