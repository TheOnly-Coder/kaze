import { genId, loadLinkState, topicForPort, ntfyPublish } from "/home/kaze/lib/link.js";

export async function main(ns) {
  const message = ns.args.map((a) => String(a)).join(" ").trim();
  if (!message) {
    ns.tprint("Usage: send [message]");
    return;
  }

  // Prefer active web P2P connection if present.
  let p2p = null;
  try { p2p = eval("window").__kazeP2P; } catch (e) { p2p = null; }
  if (p2p && p2p.conn && p2p.connected) {
    try {
      p2p.conn.send(message);
      ns.tprint("Sent.");
      return;
    } catch (e) {
      ns.tprint("send: failed over P2P, trying port relay...");
    }
  }

  const state = loadLinkState();
  if (!state || !state.peer) {
    ns.tprint("send: not connected. Run 'connect [port|url]' or 'expose [port|web]' first.");
    return;
  }
  if (state.web) {
    ns.tprint("send: web P2P connection not active.");
    return;
  }
  const ok = await ntfyPublish(ns, topicForPort(state.port), {
    type: "msg",
    mid: genId(),
    from: state.id,
    to: state.peer,
    text: message,
  });
  ns.tprint(ok ? "Sent." : "send: failed to publish message.");
}
