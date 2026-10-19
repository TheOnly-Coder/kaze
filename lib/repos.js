function getFetch() {
  try {
    const f = eval("fetch");
    if (typeof f === "function") return f;
  } catch (e) {}
  try {
    const w = eval("window");
    if (w && typeof w.fetch === "function") return w.fetch.bind(w);
  } catch (e) {}
  return null;
}

export function parseRepoSpec(input) {
  let s = String(input || "").trim();
  s = s.replace(/^git\+/i, "");
  let owner = null;
  let repo = null;
  let branch = null;
  try {
    if (/^https?:\/\//i.test(s)) {
      const u = new URL(s);
      const parts = String(u.pathname || "").replace(/^\/+|\/+$/g, "").split("/");
      if (parts.length >= 2) {
        owner = parts[0];
        repo = parts[1];
      }
      if (parts[2] === "tree" && parts.length > 3) {
        branch = parts.slice(3).join("/");
      }
    } else {
      const parts = s.split("/");
      if (parts.length >= 2) {
        owner = parts[0];
        repo = parts[1];
      }
      if (parts[2] === "tree" && parts.length > 3) {
        branch = parts.slice(3).join("/");
      }
    }
  } catch (e) {}
  if (repo) repo = repo.replace(/\.git$/i, "");
  return { owner, repo, branch, slug: owner && repo ? owner + "/" + repo : null };
}

export async function downloadRepo(ns, spec, options) {
  options = options || {};
  const info = parseRepoSpec(spec);
  if (!info.owner || !info.repo) {
    ns.tprint("install: invalid repository: " + spec);
    return { ok: false };
  }
  const fetchFn = getFetch();
  if (!fetchFn) {
    ns.tprint("install: fetch is unavailable in this environment.");
    return { ok: false };
  }

  const branchesToTry = info.branch
    ? [info.branch]
    : (options.branch ? [options.branch] : ["main", "master"]);

  let tree = null;
  let usedBranch = null;
  for (const b of branchesToTry) {
    const apiUrl = "https://api.github.com/repos/" + info.owner + "/" + info.repo + "/git/trees/" + b + "?recursive=1";
    let resp = null;
    try {
      resp = await fetchFn(apiUrl);
    } catch (e) {
      resp = null;
    }
    if (resp && resp.ok) {
      try {
        tree = await resp.json();
        usedBranch = b;
        break;
      } catch (e) {
        tree = null;
      }
    }
  }

  if (!tree || !Array.isArray(tree.tree)) {
    ns.tprint("install: unable to fetch repository tree for " + info.owner + "/" + info.repo);
    return { ok: false };
  }

  const files = tree.tree.filter(function (item) { return item && item.type === "blob"; });
  ns.tprint("Found " + files.length + " files in " + info.owner + "/" + info.repo + " (" + usedBranch + "). Downloading...");

  const prefix = options.prefix ? String(options.prefix).replace(/\/+$/, "") : "";
  let downloaded = 0;
  let failed = 0;
  for (const file of files) {
    const rawUrl = "https://raw.githubusercontent.com/" + info.owner + "/" + info.repo + "/" + usedBranch + "/" + file.path;
    const dest = prefix ? prefix + "/" + file.path : file.path;
    let ok = false;
    try {
      ok = await ns.wget(rawUrl, dest);
    } catch (e) {
      ok = false;
    }
    if (ok) {
      downloaded++;
      ns.tprint("[" + downloaded + "/" + files.length + "] Downloaded: " + dest);
    } else {
      failed++;
      ns.tprint("[FAILED] Could not download: " + dest);
    }
  }

  ns.tprint("\nSUCCESS: Downloaded " + downloaded + "/" + files.length + " files.");
  if (tree.truncated) {
    ns.tprint("Warning: repository tree was truncated by the GitHub API.");
  }
  return { ok: true, downloaded, total: files.length, failed, branch: usedBranch, owner: info.owner, repo: info.repo };
}

export async function installFromArgs(ns, args) {
  const tokens = (args || []).map(function (a) { return String(a); });
  while (tokens.length && ["install", "get", "clone", "download", "add"].includes(tokens[0].toLowerCase())) {
    tokens.shift();
  }
  const target = tokens.join(" ").trim();
  if (!target) {
    ns.tprint("Usage: apt install <github repo url or owner/repo>");
    ns.tprint("       sudo apt install <github repo url or owner/repo>");
    ns.tprint("       git clone <github repo url or owner/repo>");
    return { ok: false };
  }
  return await downloadRepo(ns, target);
}
