export async function main(ns) {
  const first = String(ns.args[0] || "").toLowerCase();
  const script = (first === "web") ? "/home/kaze/expose-web.js" : "/home/kaze/expose-port.js";
  const pid = ns.run(script, 1, ...ns.args);
  ns.tprint(pid ? "Started " + script : "Failed to start " + script);
}
