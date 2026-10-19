import { installFromArgs } from "/home/kaze/lib/repos.js";

function argsAfter(args, i) { return args.slice(i); }

function readFile(ns, f) {
  try { return ns.read(f); } catch (e) { return null; }
}

export async function main(ns) {
  const args = ns.args.map((a) => String(a));
  const cmd = (args[0] || "help").toLowerCase();
  const rest = args.slice(1);

  switch (cmd) {
    case "help":
    case "usage":
      printUsage(ns);
      return;
    case "ls":
    case "dir":
    case "vdir":
      await cmdLs(ns, rest);
      return;
    case "pwd":
      ns.tprint(ns.getHostname() ? "/" + ns.getHostname() : "/");
      return;
    case "echo":
    case "printf":
      ns.tprint(rest.join(" "));
      return;
    case "cat":
    case "tac":
      await cmdCat(ns, rest);
      return;
    case "touch":
      await cmdTouch(ns, rest);
      return;
    case "mkdir":
      await cmdMkdir(ns, rest);
      return;
    case "rmdir":
      await cmdRmdir(ns, rest);
      return;
    case "rm":
    case "del":
    case "unlink":
      await cmdRm(ns, rest);
      return;
    case "cp":
    case "copy":
      await cmdCp(ns, rest);
      return;
    case "mv":
    case "move":
    case "rename":
      await cmdMv(ns, rest);
      return;
    case "head":
      await cmdHead(ns, rest);
      return;
    case "tail":
      await cmdTail(ns, rest);
      return;
    case "wc":
      await cmdWc(ns, rest);
      return;
    case "grep":
    case "egrep":
    case "fgrep":
      await cmdGrep(ns, rest);
      return;
    case "find":
    case "locate":
      await cmdFind(ns, rest);
      return;
    case "ps":
      await cmdPs(ns, rest);
      return;
    case "top":
    case "htop":
      await cmdTop(ns, rest);
      return;
    case "kill":
    case "pkill":
      await cmdKill(ns, rest);
      return;
    case "killall":
      await cmdKillall(ns, rest);
      return;
    case "whoami":
    case "who":
      try {
        const p = ns.getPlayer();
        ns.tprint(p && p.name ? p.name : "root");
      } catch (e) {
        ns.tprint("root");
      }
      return;
    case "hostname":
      ns.tprint(ns.getHostname());
      return;
    case "uname":
      ns.tprint("Bitburner 3.0.1 (Kaze OS)");
      return;
    case "date":
      ns.tprint(new Date().toString());
      return;
    case "uptime":
      ns.tprint("uptime: unavailable");
      return;
    case "clear":
    case "cls":
      for (let i = 0; i < 40; i++) ns.tprint("");
      return;
    case "curl":
    case "wget":
      await cmdWget(ns, rest);
      return;
    case "git":
      await cmdGit(ns, rest);
      return;
    case "apt":
    case "apt-get":
    case "aptitude":
      await cmdApt(ns, rest);
      return;
    case "sudo":
    case "su":
      await cmdSudo(ns, rest);
      return;
    case "free":
      await cmdFree(ns, rest);
      return;
    case "mem":
      await cmdMem(ns, rest);
      return;
    case "df":
      await cmdDf(ns, rest);
      return;
    case "du":
      await cmdDu(ns, rest);
      return;
    case "sort":
      await cmdSort(ns, rest);
      return;
    case "uniq":
      await cmdUniq(ns, rest);
      return;
    case "cut":
      await cmdCut(ns, rest);
      return;
    case "tr":
      await cmdTr(ns, rest);
      return;
    case "history":
      ns.tprint("history: unavailable");
      return;
    case "man":
      ns.tprint("man: try 'help'");
      return;
    case "exit":
    case "logout":
    case "quit":
      ns.tprint("exit: close the terminal tab manually");
      return;
    case "reboot":
    case "shutdown":
    case "poweroff":
      ns.tprint("reboot: not supported in Bitburner");
      return;
    case "install":
    case "clone":
      await installFromArgs(ns, rest);
      return;
    default:
      ns.tprint("linux: unknown command '" + cmd + "'. Try 'linux help'.");
      return;
  }
}

function printUsage(ns) {
  ns.tprint("=== Kaze Linux Commands ===");
  const cmds = [
    "ls [-al] [filter]", "pwd", "echo <text>", "cat <file>", "touch <file>", "mkdir <dir>",
    "rm <file>", "cp <src> <dst>", "mv <src> <dst>", "head <file>", "tail <file>", "wc <file>",
    "grep <pattern> <file>", "find <name>", "ps", "top", "kill <pid|script>", "killall",
    "whoami", "hostname", "uname", "date", "clear", "curl/wget <url> [dest]",
    "git clone <repo>", "apt install <repo>", "sudo apt install <repo>", "free", "mem",
    "df", "du", "sort/uniq/cut/tr <file>", "exit"
  ];
  for (const c of cmds) ns.tprint("  " + c);
}

async function cmdLs(ns, rest) {
  const flags = rest.filter((a) => a.startsWith("-"));
  const paths = rest.filter((a) => !a.startsWith("-"));
  const showAll = flags.some((f) => f.indexOf("a") >= 0);
  const long = flags.some((f) => f.indexOf("l") >= 0);
  const filter = paths.join(" ").trim();
  let files = [];
  try {
    files = ns.ls("home", filter);
  } catch (e) {
    files = ns.ls("home");
  }
  if (!showAll) {
    files = files.filter((f) => {
      const base = String(f).split("/").pop();
      return !base.startsWith(".");
    });
  }
  for (const f of files) {
    if (long) {
      ns.tprint(f);
    } else {
      ns.tprint(f);
    }
  }
  if (!files.length) ns.tprint("(empty)");
}

async function cmdCat(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: cat <file>"); return; }
  for (const f of rest) {
    const c = readFile(ns, f);
    if (c === null) {
      // try under /home/kaze
      const c2 = readFile(ns, "/home/kaze/" + f);
      if (c2 === null) { ns.tprint("cat: not found: " + f); continue; }
      ns.tprint("=== " + f + " ===");
      ns.tprint(c2);
    } else {
      ns.tprint("=== " + f + " ===");
      ns.tprint(c);
    }
  }
}

async function cmdTouch(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: touch <file>"); return; }
  for (const f of rest) {
    if (!ns.fileExists(f, "home")) {
      try { ns.write(f, "", "w"); ns.tprint("created " + f); }
      catch (e) { ns.tprint("touch: failed " + f); }
    }
  }
}

async function cmdMkdir(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: mkdir <dir>"); return; }
  for (const d of rest) {
    const p = d.replace(/\/+$/, "") + "/.keep";
    try { ns.write(p, "", "w"); ns.tprint("created directory " + d); }
    catch (e) { ns.tprint("mkdir: failed " + d); }
  }
}

async function cmdRmdir(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: rmdir <dir>"); return; }
  for (const d of rest) {
    try {
      const vars = [d];
      for (const f of ns.ls("home")) {
        if (String(f).startsWith(d.replace(/\/+$/, "") + "/")) ns.rm(f, "home");
      }
      ns.tprint("removed directory " + d);
    } catch (e) { ns.tprint("rmdir: failed " + d); }
  }
}

async function cmdRm(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: rm <file>"); return; }
  for (const t of rest) {
    try {
      if (ns.rm(t, "home")) ns.tprint("removed " + t);
      else ns.tprint("rm: not found: " + t);
    } catch (e) { ns.tprint("rm: failed " + t); }
  }
}

async function cmdCp(ns, rest) {
  if (rest.length < 2) { ns.tprint("Usage: cp <src> <dst>"); return; }
  const src = rest[0];
  const dst = rest[1];
  const content = readFile(ns, src);
  if (content === null) { ns.tprint("cp: not found: " + src); return; }
  try { ns.write(dst, content, "w"); ns.tprint("copied " + src + " -> " + dst); }
  catch (e) { ns.tprint("cp: failed"); }
}

async function cmdMv(ns, rest) {
  if (rest.length < 2) { ns.tprint("Usage: mv <src> <dst>"); return; }
  const src = rest[0];
  const dst = rest[1];
  const content = readFile(ns, src);
  if (content === null) { ns.tprint("mv: not found: " + src); return; }
  try {
    ns.write(dst, content, "w");
    ns.rm(src, "home");
    ns.tprint("moved " + src + " -> " + dst);
  } catch (e) { ns.tprint("mv: failed"); }
}

async function cmdHead(ns, rest) {
  const n = (rest[0] && /^-?\d+$/.test(rest[0])) ? Math.abs(parseInt(rest[0], 10)) : 10;
  const file = rest[rest[0] && /^-?\d+$/.test(rest[0]) ? 1 : 0];
  if (!file) { ns.tprint("Usage: head [-n] <file>"); return; }
  const c = readFile(ns, file);
  if (c === null) { ns.tprint("head: not found: " + file); return; }
  const lines = String(c).split("\n");
  for (let i = 0; i < Math.min(n, lines.length); i++) ns.tprint(lines[i]);
}

async function cmdTail(ns, rest) {
  const n = (rest[0] && /^-?\d+$/.test(rest[0])) ? Math.abs(parseInt(rest[0], 10)) : 10;
  const file = rest[rest[0] && /^-?\d+$/.test(rest[0]) ? 1 : 0];
  if (!file) { ns.tprint("Usage: tail [-n] <file>"); return; }
  const c = readFile(ns, file);
  if (c === null) { ns.tprint("tail: not found: " + file); return; }
  const lines = String(c).split("\n");
  const start = Math.max(0, lines.length - n);
  for (let i = start; i < lines.length; i++) ns.tprint(lines[i]);
}

async function cmdWc(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: wc <file>"); return; }
  for (const f of rest) {
    const c = readFile(ns, f);
    if (c === null) { ns.tprint("wc: not found: " + f); continue; }
    const s = String(c);
    const lines = s.split("\n").length;
    const words = s.trim() ? s.trim().split(/\s+/).length : 0;
    const bytes = s.length;
    ns.tprint(lines + " " + words + " " + bytes + " " + f);
  }
}

async function cmdGrep(ns, rest) {
  if (rest.length < 2) { ns.tprint("Usage: grep <pattern> <file>"); return; }
  const pattern = rest[0];
  const files = rest.slice(1);
  let re;
  try { re = new RegExp(pattern); }
  catch (e) { re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")); }
  for (const f of files) {
    const c = readFile(ns, f);
    if (c === null) { ns.tprint("grep: not found: " + f); continue; }
    const lines = String(c).split("\n");
    for (const line of lines) {
      if (re.test(line)) {
        if (files.length > 1) ns.tprint(f + ": " + line);
        else ns.tprint(line);
      }
    }
  }
}

async function cmdFind(ns, rest) {
  const name = rest.join(" ").trim();
  const files = ns.ls("home");
  const out = name ? files.filter((f) => String(f).toLowerCase().indexOf(name.toLowerCase()) >= 0) : files;
  for (const f of out) ns.tprint(f);
  if (!out.length) ns.tprint("find: no matches");
}

async function cmdPs(ns, rest) {
  const host = rest[0] || "home";
  let ps = [];
  try { ps = ns.ps(host); } catch (e) { ps = ns.ps("home"); }
  for (const p of ps) {
    ns.tprint(p.pid + "  " + p.threads + "  " + p.filename + "  " + (p.args || []).join(" "));
  }
  if (!ps.length) ns.tprint("(no processes)");
}

async function cmdTop(ns, rest) {
  const host = rest[0] || "home";
  let ps = [];
  try { ps = ns.ps(host); } catch (e) { ps = ns.ps("home"); }
  for (const p of ps) {
    let ram = 0;
    try { ram = ns.getScriptRam(p.filename, host) * p.threads; } catch (e) {}
    ns.tprint(p.pid + "  " + p.threads + "  " + ram.toFixed(2) + "GB  " + p.filename);
  }
  if (!ps.length) ns.tprint("(no processes)");
}

async function cmdKill(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: kill <pid|script>"); return; }
  for (const t of rest) {
    if (/^\d+$/.test(t)) {
      const ok = ns.kill(parseInt(t, 10));
      ns.tprint(ok ? "killed pid " + t : "kill: failed " + t);
    } else {
      const ok = ns.scriptKill(t, "home");
      ns.tprint(ok ? "killed " + t : "kill: not running " + t);
    }
  }
}

async function cmdKillall(ns, rest) {
  const host = rest[0] || "home";
  try {
    const ok = ns.killall(host);
    ns.tprint(ok ? "killed all scripts on " + host : "no scripts killed on " + host);
  } catch (e) {
    ns.tprint("killall: failed");
  }
}

async function cmdWget(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: wget <url> [dest]"); return; }
  const url = rest[0];
  const dest = rest[1] || url.split("/").pop() || "download.txt";
  try {
    const ok = await ns.wget(url, dest);
    ns.tprint(ok ? "downloaded " + url + " -> " + dest : "wget: failed " + url);
  } catch (e) {
    ns.tprint("wget: failed " + url);
  }
}

async function cmdGit(ns, rest) {
  if (rest[0] && rest[0].toLowerCase() === "clone") rest.shift();
  if (!rest.length) { ns.tprint("Usage: git clone <repo>"); return; }
  await installFromArgs(ns, rest);
}

async function cmdApt(ns, rest) {
  await installFromArgs(ns, rest);
}

async function cmdSudo(ns, rest) {
  if (rest[0] && rest[0].toLowerCase() === "apt") rest.shift();
  await installFromArgs(ns, rest);
}

async function cmdFree(ns, rest) {
  try {
    const s = ns.getServer("home");
    const ram = s.maxRam;
    const used = s.ramUsed;
    const avail = ram - used;
    ns.tprint("Total:     " + ram + "GB");
    ns.tprint("Used:      " + used + "GB");
    ns.tprint("Available: " + avail + "GB");
  } catch (e) {
    ns.tprint("free: unavailable");
  }
}

async function cmdMem(ns, rest) {
  await cmdFree(ns, rest);
}

async function cmdDf(ns, rest) {
  await cmdFree(ns, rest);
}

async function cmdDu(ns, rest) {
  const files = ns.ls("home");
  let total = 0;
  for (const f of files) {
    try { total += ns.getScriptRam(f, "home"); } catch (e) {}
  }
  ns.tprint("home: " + files.length + " files, ~" + total.toFixed(2) + "GB script RAM");
}

async function cmdSort(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: sort <file>"); return; }
  const c = readFile(ns, rest[0]);
  if (c === null) { ns.tprint("sort: not found"); return; }
  const lines = String(c).split("\n").sort();
  for (const l of lines) ns.tprint(l);
}

async function cmdUniq(ns, rest) {
  if (!rest.length) { ns.tprint("Usage: uniq <file>"); return; }
  const c = readFile(ns, rest[0]);
  if (c === null) { ns.tprint("uniq: not found"); return; }
  const lines = String(c).split("\n");
  let prev = null;
  for (const l of lines) {
    if (l !== prev) { ns.tprint(l); prev = l; }
  }
}

async function cmdCut(ns, rest) {
  if (rest.length < 1) { ns.tprint("Usage: cut <file>"); return; }
  const c = readFile(ns, rest[0]);
  if (c === null) { ns.tprint("cut: not found"); return; }
  const d = rest.includes("-d") ? rest[rest.indexOf("-d") + 1] : "\t";
  const fidx = rest.includes("-f") ? parseInt(rest[rest.indexOf("-f") + 1], 10) : 1;
  const lines = String(c).split("\n");
  for (const line of lines) {
    const parts = line.split(d);
    ns.tprint(parts[fidx - 1] !== undefined ? parts[fidx - 1] : "");
  }
}

async function cmdTr(ns, rest) {
  if (rest.length < 1) { ns.tprint("Usage: tr <file> [from] [to]"); return; }
  const c = readFile(ns, rest[0]);
  if (c === null) { ns.tprint("tr: not found"); return; }
  const from = rest[1] || "a";
  const to = rest[2] || "A";
  let s = String(c);
  for (let i = 0; i < from.length && i < to.length; i++) {
    s = s.split(from[i]).join(to[i]);
  }
  ns.tprint(s);
}
