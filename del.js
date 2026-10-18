function strip(p) {
  return String(p).replace(/^\/+/, "");
}

function variants(target) {
  const out = new Set();
  const base = strip(target).replace(/\/+$/, "");
  if (!base || base === "." || base === "..") return out;
  if (base !== "home") out.add(base);
  let v = base;
  if (/^home\//i.test(v)) {
    v = v.replace(/^home\//i, "");
    if (v && v !== "home") out.add(v);
  }
  if (/^kaze\//i.test(v)) {
    v = v.replace(/^kaze\//i, "");
    if (v) out.add(v);
  }
  return out;
}

function matches(entry, vars) {
  const e = strip(entry).replace(/\/+$/, "");
  for (const v of vars) {
    if (e === v || e === v + ".js" || e.startsWith(v + "/")) return true;
  }
  for (const v of vars) {
    if (e.endsWith("/" + v) || e.endsWith("/" + v + ".js") || e.includes("/" + v + "/")) return true;
  }
  return false;
}

export async function main(ns) {
  const args = ns.args.map((a) => String(a)).filter((a) => a.length > 0);
  if (!args.length || args.some((a) => a === "help" || a === "-h" || a === "--help")) {
    ns.tprint("Usage: del <file|folder>...");
    ns.tprint("Force-deletes files on home. A folder name removes everything under it.");
    ns.tprint("Examples: del boot.js   del games/snake.js   del games");
    return;
  }
  let removed = 0;
  let missing = 0;
  for (const target of args) {
    const vars = variants(target);
    if (!vars.size) {
      ns.tprint("del: refusing to delete everything, name a file or folder.");
      continue;
    }
    const found = new Set();
    try {
      for (const entry of ns.ls("home")) {
        if (matches(entry, vars)) found.add(entry);
      }
    } catch (e) {}
    if (!found.size) {
      try { if (ns.fileExists(target, "home")) found.add(target); } catch (e) {}
    }
    if (!found.size) {
      ns.tprint("del: not found: " + target);
      missing++;
      continue;
    }
    for (const f of found) {
      try {
        if (ns.rm(f, "home")) {
          removed++;
          ns.tprint("deleted " + f);
        }
      } catch (e) {}
    }
  }
  let msg = "del: " + removed + " file(s) removed";
  if (missing) msg += ", " + missing + " not found";
  ns.tprint(msg + ".");
}
