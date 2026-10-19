export async function main(ns) {
  const raw = String(ns.args[0] || "").trim();
  const port = parseInt(raw, 10);
  const isPort = raw.length > 0 && !Number.isNaN(port) && String(port) === raw && !raw.includes(":");
  const script = isPort ? "/home/kaze/connect-port.js" : "/home/kaze/connect-web.js";
  const pid = ns.run(script, 1, ...ns.args);
  ns.tprint(pid ? "Started " + script : "Failed to start " + script);
}
