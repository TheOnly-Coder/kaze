export async function main(ns) {
  const message = ns.args.map((a) => String(a)).join(" ").trim();
  if (!message) {
    ns.tprint("Usage: send [message]");
    return;
  }
  let web = true;
  try {
    const raw = ns.read("/home/kaze/.kaze_link_state.json");
    if (raw) {
      const st = JSON.parse(String(raw));
      if (st && st.peer && !st.web) web = false;
    }
  } catch (e) {}
  const script = web ? "/home/kaze/send-web.js" : "/home/kaze/send-port.js";
  const pid = ns.run(script, 1, ...ns.args);
  ns.tprint(pid ? "Started " + script : "Failed to start " + script);
}
