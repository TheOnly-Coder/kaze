import { loadLinkState, topicForPort, ntfyPublish, genId } from "/home/kaze/lib/link.js";

export async function main(ns) {
  const message = ns.args.map((a) => String(a)).join(" ").trim();
  if (!message) {
    ns.tprint("Usage: send [message]");
    return;
  }
  const state = loadLinkState(ns);
  if (!state || !state.peer || state.web) {
    ns.tprint("send-port: not connected via port relay.");
    return;
  }
  const ok = await ntfyPublish(ns, topicForPort(state.port), {
    type: "msg",
    mid: genId(),
    from: state.id,
    to: state.peer,
    text: message,
  });
  ns.tprint(ok ? "Sent." : "send-port: failed to publish message.");
}
