import { genId, loadLinkState, topicForPort, ntfyPublish } from "/home/kaze/lib/link.js";

export async function main(ns) {
  const message = ns.args.map((a) => String(a)).join(" ").trim();
  if (!message) {
    ns.tprint("Usage: send [message]");
    return;
  }
  const state = loadLinkState();
  if (!state || !state.peer) {
    ns.tprint("send: not connected. Run 'connect [port]' or 'expose [port]' first.");
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
