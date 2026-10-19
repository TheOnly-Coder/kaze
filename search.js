import { searchWeb, fetchText } from "/home/kaze/lib/browser.js";

export async function main(ns) {
  const query = ns.args.map((a) => String(a)).join(" ").trim();
  if (!query) {
    ns.tprint("Usage: search <query>  (or search <website> for full text)");
    return;
  }
  const looksLikeUrl = ns.args.length === 1 && (/^https?:\/\//i.test(query) || /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(query));
  if (looksLikeUrl) {
    ns.tprint("Loading: " + query);
    const res = await fetchText(ns, query);
    if (!res.ok) { ns.tprint("search: " + res.error); return; }
    const text = String(res.text || "").trim();
    if (!text) { ns.tprint("search: empty page."); return; }
    ns.tprint("=== " + res.url + " (" + text.length + " chars) ===");
    for (const line of text.split(/\n/)) {
      if (line.trim().length === 0) continue;
      ns.tprint(line);
    }
    return;
  }
  ns.tprint("Searching: " + query);
  let results = [];
  try {
    results = await searchWeb(ns, query);
  } catch (e) {
    ns.tprint("search: error " + e);
    return;
  }
  if (!results || !results.length) {
    ns.tprint("No URLs found.");
    return;
  }
  ns.tprint("Found " + results.length + " URL(s):");
  for (const r of results) {
    if (r.title) ns.tprint(r.url + "  - " + r.title);
    else ns.tprint(r.url);
  }
}
