async function printLogo(ns) {
  let logo = "";
  const cands = ["/home/kaze/logo.txt", "logo.txt", "/logo.txt"];
  for (const p of cands) {
    try { const c = ns.read(p); if (c) { logo = c; break; } } catch (e) {}
  }
  const lines = String(logo || "").split("\n");
  for (const line of lines) { ns.tprint(line); await ns.sleep(8); }
}

export async function main(ns) {
  await printLogo(ns);
  ns.tprint("Kaze setup starting...");
  const destRoot = "/home/kaze";
  const files = ns.ls("home");
  for (const f of files) {
    if (f === "setup.js") continue;
    if (String(f).startsWith(destRoot)) continue;
    const dest = destRoot + "/" + f;
    if (ns.fileExists(dest, "home")) continue;
    try { ns.mv("home", f, dest); ns.tprint("moved " + f + " -> " + dest); }
    catch (e) { ns.tprint("failed move " + f + ": " + e); }
  }
  try { ns.mv("home", "setup.js", destRoot + "/setup.js"); } catch (e) {}

  const aliasMap = {
    boot: "boot.js", setup: "setup.js", kaze: "kaze.js", play: "play.js", upgram: "upgram.js",
    status: "status.js", scan: "scan.js", nuke: "nuke.js", hack: "hack.js", grow: "grow.js",
    weaken: "weaken.js", hacknet: "hacknet.js", servers: "servers.js", stock: "stock.js",
    sleeve: "sleeves.js", sleeves: "sleeves.js", gang: "gangs.js", gangs: "gangs.js",
    blade: "blade.js", corp: "corp.js", contracts: "contracts.js", auto: "auto.js",
    autohack: "auto.js", money: "money.js", ram: "ram.js", ports: "ports.js", help: "help.js",
    kazehelp: "help.js", kazever: "version.js",
  };
  for (const [name, file] of Object.entries(aliasMap)) {
    const cmd = "run " + destRoot + "/" + file;
    try { ns.ui.alias(name, cmd, false); } catch (e) {
      try {
        const ti = eval("document").getElementById("terminal-input");
        const h = Object.keys(ti)[1];
        ti.value = 'alias ' + name + '="' + cmd + '"';
        ti[h].onChange({ target: ti });
        ti[h].onKeyDown({ key: "Enter", preventDefault: () => null });
      } catch (e2) {}
    }
    ns.tprint("aliased " + name);
  }
  ns.tprint("Kaze setup complete. Run 'boot'.");
}
