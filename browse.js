import { fetchText } from "/home/kaze/lib/browser.js";

export async function main(ns) {
  const target = ns.args.map((a) => String(a)).join(" ").trim();
  if (!target) {
    ns.tprint("Usage: browse <website>");
    return;
  }
  ns.tprint("Loading: " + target);
  const res = await fetchText(ns, target);
  if (!res.ok) {
    ns.tprint("browse: " + res.error);
    return;
  }
  const text = String(res.text || "").trim();
  if (!text) {
    ns.tprint("browse: empty page.");
    return;
  }
  ns.tprint("=== " + res.url + " (" + text.length + " chars) ===");
  const lines = text.split(/\n/);
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    ns.tprint(line);
  }
}
