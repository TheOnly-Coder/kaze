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
    autohack: "auto.js", money: "money.js", ram: "ram.js", ports: "ports.js", connect: "connect.js", expose: "expose.js", send: "send.js", help: "help.js",
    kazehelp: "help.js", kazever: "version.js", update: "update.js", del: "del.js",
    search: "search.js", google: "search.js", lookup: "search.js",
    browse: "browse.js", fetch: "browse.js", read: "browse.js", page: "browse.js",
    open: "browse.js", visit: "browse.js", site: "browse.js", view: "browse.js",
    searchsite: "browse.js", searchpage: "browse.js",
    web: "web.js", find: "web.js", snippet: "web.js", locate: "web.js",
    browser: "browser.js", kbrowser: "browser.js",
    free: "free.js", mem: "linux.js mem", df: "linux.js df", du: "linux.js du",
    apt: "apt.js", "apt-get": "apt.js", aptitude: "apt.js", sudo: "sudo.js", su: "sudo.js",
    git: "git.js", install: "apt.js", clone: "git.js",
    ls: "linux.js ls", ll: "linux.js ls -l", la: "linux.js ls -a", l: "linux.js ls", dir: "linux.js ls",
    cat: "linux.js cat", tac: "linux.js cat", pwd: "linux.js pwd", echo: "linux.js echo", printf: "linux.js echo",
    touch: "linux.js touch", mkdir: "linux.js mkdir", rmdir: "linux.js rmdir",
    rm: "linux.js rm", cp: "linux.js cp", mv: "linux.js mv", rename: "linux.js mv",
    head: "linux.js head", tail: "linux.js tail", wc: "linux.js wc",
    grep: "linux.js grep", egrep: "linux.js grep", fgrep: "linux.js grep",
    find: "linux.js find", locate: "linux.js find", searchfile: "linux.js find",
    ps: "linux.js ps", top: "linux.js top", htop: "linux.js top",
    kill: "linux.js kill", pkill: "linux.js kill", killall: "linux.js killall",
    whoami: "linux.js whoami", who: "linux.js whoami", hostname: "linux.js hostname", uname: "linux.js uname",
    date: "linux.js date", uptime: "linux.js uptime", clear: "linux.js clear", cls: "linux.js clear",
    curl: "linux.js curl", wget: "linux.js wget", sort: "linux.js sort", uniq: "linux.js uniq",
    cut: "linux.js cut", tr: "linux.js tr", history: "linux.js history", man: "help.js",
    exit: "linux.js exit", logout: "linux.js exit", quit: "linux.js exit",
    reboot: "linux.js reboot", shutdown: "linux.js shutdown", poweroff: "linux.js shutdown",
  };

  for (const g of ["guess", "rps", "hangman", "blackjack", "slots", "ttt", "tictactoe", "2048", "g2048",
    "minesweeper", "snake", "wordle", "higherlower", "mathquiz", "roulette", "coinflip", "quiz", "number"]) {
    if (!(g in aliasMap)) aliasMap[g] = "play.js " + g;
  }

  // Integrated Bitburner scripts (alainbryden/bitburner-scripts) aliases.
  const bb = "bitburner-scripts";
  const bbScripts = [
    "autopilot", "daemon", "scan", "casino", "reserve", "faction-manager", "work-for-factions",
    "crime", "ascend", "spend-hacknet-hashes", "farm-intelligence", "cleanup", "run-command",
    "host-manager", "stockmaster", "sleeve", "gangs", "bladeburner", "stanek", "stats",
    "analyze-hack", "hacknet-upgrade-manager", "go", "kill-all-scripts", "grep",
  ];
  for (const name of bbScripts) {
    aliasMap["bb-" + name] = bb + "/" + name + ".js";
  }
  // Friendly aliases (non-conflicting with Kaze commands).
  const bbFriendly = {
    autopilot: "autopilot", daemon: "daemon", casino: "casino", reserve: "reserve",
    facman: "faction-manager", work: "work-for-factions", crime: "crime", ascend: "ascend",
    hashes: "spend-hacknet-hashes", farmint: "farm-intelligence", cleanup: "cleanup",
    do: "run-command", sscan: "scan", hostman: "host-manager", stockmaster: "stockmaster",
    bsleeve: "sleeve",     bgangs: "gangs", bladeburner: "bladeburner", stanek: "stanek",
    bstats: "stats", bgo: "go", killallscripts: "kill-all-scripts", bgrep: "grep",
  };
  for (const [alias, script] of Object.entries(bbFriendly)) {
    if (!(alias in aliasMap)) aliasMap[alias] = bb + "/" + script + ".js";
  }
  // bb-prefixed aliases for Task scripts (internal helpers, still runnable).
  const bbTasks = [
    "backdoor-all-servers", "contractor", "crack-host", "program-manager", "ram-manager",
    "run-with-delay", "tor-manager", "write-file",
  ];
  for (const name of bbTasks) {
    aliasMap["bb-task-" + name] = bb + "/Tasks/" + name + ".js";
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
  ns.tprint("Integrated Bitburner scripts available under 'bb-*' aliases (e.g. 'bb-daemon', 'bb-autopilot', 'sscan').");
}
