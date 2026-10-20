export async function main(ns) {
  const args = ns.args.map((a) => String(a));
  if (args.length < 2) {
    ns.tprint("Usage: runon [server name] [script name.js or an alias command] [args]");
    return;
  }

  const server = args[0];
  const name = args[1];
  const extra = args.slice(2);

  if (!ns.serverExists(server)) {
    ns.tprint("runon: unknown server: " + server);
    return;
  }
  if (!ns.hasRootAccess(server)) {
    ns.tprint("runon: no root access on " + server + ". Run: nuke " + server);
    return;
  }

  let scriptPath = name;
  let scriptArgs = [...extra];

  // Resolve terminal aliases (e.g. "hack" -> "run /home/kaze/hack.js").
  try {
    const aliases = ns.ui.getAllAliases();
    let entry = null;
    if (aliases && typeof aliases.get === "function") entry = aliases.get(name);
    else if (aliases) entry = aliases[name];
    if (entry) {
      const subst = (entry.substitution !== undefined) ? entry.substitution : entry;
      const parts = String(subst).trim().split(/\s+/);
      if (parts.length && parts[0].toLowerCase() === "run") parts.shift();
      if (parts.length) {
        scriptPath = parts[0];
        scriptArgs = parts.slice(1).concat(scriptArgs);
      }
    }
  } catch (e) {}

  // Resolve a bare script name to a home file path.
  function resolve(p) {
    if (ns.fileExists(p, "home")) return p;
    const prefixed = "/home/kaze/" + String(p).replace(/^\/+/, "");
    if (ns.fileExists(prefixed, "home")) return prefixed;
    if (!String(p).endsWith(".js") && !String(p).endsWith(".ts")) {
      const withExt = p + ".js";
      if (ns.fileExists(withExt, "home")) return withExt;
      const prefExt = "/home/kaze/" + String(p).replace(/^\/+/, "") + ".js";
      if (ns.fileExists(prefExt, "home")) return prefExt;
    }
    return p;
  }
  scriptPath = resolve(scriptPath);

  if (!ns.fileExists(scriptPath, "home") && !ns.fileExists(scriptPath, server)) {
    ns.tprint("runon: script not found: " + scriptPath);
    return;
  }

  if (server !== "home" && ns.fileExists(scriptPath, "home")) {
    try {
      await ns.scp(scriptPath, server, "home");
    } catch (e) {
      ns.tprint("runon: failed to copy script: " + e);
      return;
    }
    // Ensure imported dependencies (e.g. /home/kaze/lib/*) are present on the target.
    try {
      const files = ns.ls("home");
      if (Array.isArray(files) && files.length) await ns.scp(files, server, "home");
    } catch (e) {}
  }

  const pid = ns.exec(scriptPath, server, 1, ...scriptArgs);
  if (pid) ns.tprint("runon: started " + scriptPath + " on " + server + " (pid " + pid + ")");
  else ns.tprint("runon: failed to start " + scriptPath + " on " + server + " (RAM or file missing)");
}
