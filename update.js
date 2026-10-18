const REPO = "TheOnly-Coder/kaze";
const BRANCH = "main";
const API_URL = "https://api.github.com/repos/" + REPO + "/git/trees/" + BRANCH + "?recursive=1";
const RAW_URL = "https://raw.githubusercontent.com/" + REPO + "/" + BRANCH + "/";

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

function installRoot(ns) {
  const cands = ["/home/kaze/", "home/kaze/", "/kaze/", "kaze/"];
  for (const c of cands) {
    try { if (ns.fileExists(c + "lib/common.js", "home")) return c; } catch (e) {}
  }
  for (const c of cands) {
    try { if (ns.fileExists(c + "boot.js", "home")) return c; } catch (e) {}
  }
  try {
    const self = String(ns.getScriptName()).replace(/^\/+/, "");
    const idx = self.lastIndexOf("/");
    if (idx >= 0) return self.slice(0, idx + 1);
  } catch (e) {}
  return "/home/kaze/";
}

function utf8Bytes(str) {
  const out = [];
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 0x80) {
      out.push(c);
    } else if (c < 0x800) {
      out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    } else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
      const c2 = str.charCodeAt(i + 1);
      if (c2 >= 0xdc00 && c2 <= 0xdfff) {
        const cp = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
        i++;
      } else {
        out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      }
    } else {
      out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
  }
  return new Uint8Array(out);
}

function sha1Hex(bytes) {
  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const len = bytes.length;
  const total = (((len + 8) >> 6) + 1) << 6;
  const msg = new Uint8Array(total);
  msg.set(bytes);
  msg[len] = 0x80;
  const view = new DataView(msg.buffer);
  view.setUint32(total - 8, Math.floor(len / 0x20000000));
  view.setUint32(total - 4, ((len % 0x20000000) * 8) >>> 0);
  const w = new Uint32Array(80);
  for (let i = 0; i < total; i += 64) {
    for (let j = 0; j < 16; j++) w[j] = view.getUint32(i + j * 4);
    for (let j = 16; j < 80; j++) {
      const v = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
      w[j] = ((v << 1) | (v >>> 31)) >>> 0;
    }
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4];
    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
      else if (j < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
      else { f = b ^ c ^ d; k = 0xca62c1d6; }
      const t = ((((a << 5) | (a >>> 27)) >>> 0) + f + e + k + w[j]) >>> 0;
      e = d;
      d = c;
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }
    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
  }
  let hex = "";
  for (const h of H) hex += h.toString(16).padStart(8, "0");
  return hex;
}

function gitBlobSha(content) {
  const body = utf8Bytes(content);
  const header = utf8Bytes("blob " + body.length + "\0");
  const full = new Uint8Array(header.length + body.length);
  full.set(header);
  full.set(body, header.length);
  return sha1Hex(full);
}

function encodePath(path) {
  return path.split("/").map((s) => encodeURIComponent(s)).join("/");
}

export async function main(ns) {
  const args = ns.args.map((a) => String(a).toLowerCase());
  if (args.includes("help")) {
    ns.tprint("Usage: run update.js [prune]");
    ns.tprint("Downloads new and changed Kaze files from github.com/" + REPO + ".");
    ns.tprint("prune also deletes local Kaze files that were removed from the repo.");
    return;
  }
  const prune = args.includes("prune");
  const fetchFn = getFetch();
  if (!fetchFn) {
    ns.tprint("update: fetch() is unavailable here, cannot reach GitHub.");
    return;
  }
  const root = installRoot(ns);
  const rootRel = root.replace(/^\/+/, "").replace(/^home\//i, "");
  ns.tprint("Kaze update: checking github.com/" + REPO + " (" + BRANCH + ") ...");
  let data;
  try {
    const res = await fetchFn(API_URL, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
    data = await res.json();
  } catch (e) {
    ns.tprint("update: could not read repo info: " + e);
    return;
  }
  if (data.truncated) ns.tprint("update: warning: GitHub truncated the file listing.");
  const files = (data.tree || []).filter((t) => t.type === "blob" && typeof t.path === "string");
  if (!files.length) {
    ns.tprint("update: repo listing is empty.");
    return;
  }
  const upstream = new Map(files.map((f) => [f.path, f.sha]));

  let added = 0, changed = 0, same = 0, failed = 0;
  for (const f of files) {
    const local = root + f.path;
    let exists = false;
    try { exists = ns.fileExists(local, "home"); } catch (e) { exists = false; }
    if (exists) {
      let content = "";
      try { content = ns.read(local); } catch (e) { content = ""; }
      if (gitBlobSha(content) === f.sha) {
        same++;
        continue;
      }
    }
    let body = "";
    try {
      const res = await fetchFn(RAW_URL + encodePath(f.path));
      if (!res.ok) throw new Error("HTTP " + res.status);
      body = await res.text();
    } catch (e) {
      failed++;
      ns.tprint("  ! " + f.path + " (" + e + ")");
      continue;
    }
    try {
      ns.write(local, body, "w");
      if (exists) {
        changed++;
        ns.tprint("  ~ " + f.path);
      } else {
        added++;
        ns.tprint("  + " + f.path);
      }
    } catch (e) {
      failed++;
      ns.tprint("  ! " + f.path + " (write failed)");
    }
  }

  let removed = 0;
  if (prune) {
    if (!rootRel) {
      ns.tprint("update: skipping prune, install folder could not be determined.");
    } else {
      let selfName = "";
      try { selfName = String(ns.getScriptName()).replace(/^\/+/, ""); } catch (e) {}
      const raw = ns.ls("home");
      const entries = raw.map((e) => e.replace(/^\/+/, ""));
      const prefixCands = ["home/" + rootRel, rootRel];
      let lsPrefix = prefixCands.find((p) => entries.some((e) => e.startsWith(p)));
      if (!lsPrefix) lsPrefix = prefixCands[0];
      for (let i = 0; i < raw.length; i++) {
        const norm = entries[i];
        if (!norm.startsWith(lsPrefix)) continue;
        const rel = norm.slice(lsPrefix.length);
        if (!rel || upstream.has(rel)) continue;
        if (norm === selfName || rel === "update.js") continue;
        if (rel.startsWith("config/")) continue;
        try {
          if (ns.rm(raw[i], "home")) {
            removed++;
            ns.tprint("  - " + rel);
          }
        } catch (e) {}
      }
    }
  }

  let msg = "Kaze update: " + added + " new, " + changed + " changed, " + same + " up to date";
  if (prune) msg += ", " + removed + " removed";
  if (failed) msg += ", " + failed + " failed";
  ns.tprint(msg + ".");
}
