export async function main(ns) {
  if (!ns.gang || !ns.gang.inGang()) { ns.tprint("Not in a gang."); return; }
  const g = ns.gang.getGangInformation();
  ns.tprint("Gang: " + g.faction + "  money:" + Math.floor(g.moneyGainRate) + "/s  territory:" + g.territory);
  const members = ns.gang.getMemberNames();
  ns.tprint("Members: " + members.join(", "));
}
