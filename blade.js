export async function main(ns) {
  if (!ns.bladeburner || !ns.bladeburner.inBladeburner()) { ns.tprint("Not in Bladeburner."); return; }
  ns.tprint("Bladeburner rank: " + ns.bladeburner.getRank());
  ns.tprint("Stamina: " + ns.bladeburner.getStamina()[0].toFixed(1) + "/" + ns.bladeburner.getStamina()[1].toFixed(1));
  ns.tprint("Skill points: " + ns.bladeburner.getSkillPoints());
}
