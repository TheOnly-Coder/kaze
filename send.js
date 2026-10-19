import { getBroadcastChannel, loadLinkState } from "/home/kaze/lib/link.js";

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
  const bc = getBroadcastChannel("kaze_link_" + state.port);
  if (!bc) {
    ns.tprint("send: BroadcastChannel unavailable in this environment.");
    return;
  }
  try {
    bc.postMessage({ type: "msg", to: state.peer, from: state.id, text: message });
    ns.tprint("Sent.");
  } catch (e) {
    ns.tprint("send: failed to send message.");
  }
}
