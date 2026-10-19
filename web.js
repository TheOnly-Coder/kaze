import { fetchText, findSnippet } from "/home/kaze/lib/browser.js";

export async function main(ns) {
  if (ns.args.length < 2) {
    ns.tprint("Usage: web <query> <website>");
    return;
  }
  const site = String(ns.args[ns.args.length - 1]).trim();
  const query = ns.args.slice(0, ns.args.length - 1).map((a) => String(a)).join(" ").trim();
  if (!query || !site) {
    ns.tprint("Usage: web <query> <website>");
    return;
  }
  ns.tprint("Searching '" + query + "' on " + site);
  const res = await fetchText(ns, site);
  if (!res.ok) {
    ns.tprint("web: " + res.error);
    return;
  }
  const text = String(res.text || "").trim();
  if (!text) {
    ns.tprint("web: empty page.");
    return;
  }
  const snippet = findSnippet(text, query, 50);
  if (!snippet) {
    ns.tprint("web: '" + query + "' not found on page.");
    return;
  }
  ns.tprint("=== " + res.url + " ===");
  ns.tprint(snippet);
}
