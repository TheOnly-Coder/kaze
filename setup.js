async function printLogo(ns) {
  let logo = "";
  const cands = ["/home/kaze/logo.txt", "logo.txt", "/logo.txt"];
  for (const p of cands) {
    try { const c = ns.read(p); if (c) { logo = c; break; } } catch (e) {}
  }
  const lines = String(logo || "").split("\n");
  for (const line of lines) { ns.tprint(line); await ns.sleep(8); }
}

function tryDomAlias(name, cmd) {
  try {
    const win = eval("window");
    const doc = eval("document");
    const ti = doc.getElementById("terminal-input");
    if (!ti) return false;
    let rk = Object.keys(ti).find((k) => k.startsWith("__reactProps") && ti[k] && typeof ti[k].onChange === "function");
    if (!rk) rk = Object.keys(ti).find((k) => ti[k] && typeof ti[k].onChange === "function");
    if (!rk) return false;
    ti.focus();
    ti.value = 'alias ' + name + '="' + cmd + '"';
    ti[rk].onChange({ target: ti });
    try {
      ti.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    } catch (e) {}
    try {
      if (typeof ti[rk].onKeyDown === "function") ti[rk].onKeyDown({ key: "Enter", preventDefault: () => null });
    } catch (e) {}
    return true;
  } catch (e) { return false; }
}

export async function main(ns) {
  await printLogo(ns);
  ns.tprint("Kaze setup starting...");
  const destRoot = "/home/kaze";
  const moveable = [".js", ".jsx", ".ts", ".tsx", ".txt", ".json", ".css"];
  const files = ns.ls("home");
  for (const f of files) {
    if (!f || String(f).endsWith("/")) continue;
    const norm = String(f).replace(/^\/+/, "");
    if (norm === "setup.js" || norm.endsWith("/setup.js")) continue;
    if (norm === "home/kaze" || norm.startsWith("home/kaze/")) continue;
    if (!moveable.some((ext) => norm.toLowerCase().endsWith(ext))) continue;
    const rel = norm.replace(/^kaze\//i, "");
    const dest = destRoot + "/" + rel;
    try {
      if (ns.fileExists(dest, "home")) ns.tprint("replacing " + dest);
      if (ns.mv("home", "/" + norm, dest)) ns.tprint("moved " + norm + " -> " + dest);
    } catch (e) { ns.tprint("failed move " + norm + ": " + e); }
  }
  try {
    if (ns.fileExists("/setup.js", "home")) ns.mv("home", "/setup.js", destRoot + "/setup.js");
  } catch (e) {}

  const aliasMap = {
    boot: "boot.js", setup: "setup.js", kaze: "kaze.js", play: "play.js", upgram: "upgram.js",
    status: "status.js", scan: "scan.js", nuke: "nuke.js", hack: "hack.js", grow: "grow.js",
    weaken: "weaken.js", hacknet: "hacknet.js", servers: "servers.js", stock: "stock.js",
    sleeve: "sleeves.js", sleeves: "sleeves.js", gang: "gangs.js", gangs: "gangs.js",
    blade: "blade.js", corp: "corp.js", contracts: "contracts.js", auto: "auto.js",
    autohack: "auto.js", money: "money.js", ram: "ram.js", ports: "ports.js", help: "help.js",
    kazehelp: "help.js", kazever: "version.js", update: "update.js", del: "del.js",
  };
  for (const g of ["guess", "rps", "hangman", "blackjack", "slots", "ttt", "tictactoe", "2048", "g2048",
    "minesweeper", "snake", "wordle", "higherlower", "mathquiz", "roulette", "coinflip", "quiz", "number"]) {
    if (!(g in aliasMap)) aliasMap[g] = "play.js " + g;
  }
  let aliased = 0;
  for (const [name, file] of Object.entries(aliasMap)) {
    const cmd = "run " + destRoot + "/" + file;
    let ok = false;
    if (typeof ns.ui.alias === "function") {
      try { ns.ui.alias(name, cmd, false); ok = true; } catch (e) {}
    }
    if (!ok) ok = tryDomAlias(name, cmd);
    if (ok) aliased++;
    else ns.tprint("Could not auto-create alias '" + name + "'. Run it manually: alias " + name + '="' + cmd + '"');
  }
  ns.tprint("Created " + aliased + "/" + Object.keys(aliasMap).length + " aliases.");
  ns.tprint("Kaze setup complete. Run 'boot'.");
}
