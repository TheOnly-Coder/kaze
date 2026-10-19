import { genId, getBroadcastChannel, saveLinkState } from "/home/kaze/lib/link.js";

export async function main(ns) {
  const port = parseInt(String(ns.args[0] || ""), 10);
  if (!port || Number.isNaN(port)) {
    ns.tprint("Usage: connect [port]");
    return;
  }
  const id = genId();
  const state = { role: "client", port, id, peer: null, connected: false };
  saveLinkState(state);
  const channelName = "kaze_link_" + port;
  const bc = getBroadcastChannel(channelName);
  if (!bc) {
    ns.tprint("connect: BroadcastChannel unavailable in this environment.");
    return;
  }
  const prints = [];
  try { eval("window").__kazeLink = Object.assign(state, { bc, prints }); } catch (e) {}

  bc.onmessage = (ev) => {
    const m = ev && ev.data;
    if (!m || typeof m !== "object") return;
    if (m.type === "connected" && m.to === id) {
      state.peer = m.from;
      state.connected = true;
      saveLinkState({ role: state.role, port: state.port, id: state.id, peer: state.peer, connected: state.connected });
      prints.push("Connected to peer " + m.from);
    } else if (m.type === "msg" && m.to === id) {
      prints.push("[peer] " + String(m.text));
    }
  };

  ns.tprint("Connecting to port " + port + "...");
  let attempts = 0;
  while (!state.connected) {
    while (prints.length) {
      const line = prints.shift();
      try { ns.tprint(line); } catch (e) {}
    }
    try { bc.postMessage({ type: "connect", from: id }); } catch (e) {}
    attempts++;
    if (attempts % 5 === 0) ns.tprint("Still trying to connect to port " + port + "...");
    await ns.sleep(1000);
  }
  ns.tprint("Connected. Messages from peer will appear here.");

  while (true) {
    while (prints.length) {
      const line = prints.shift();
      try { ns.tprint(line); } catch (e) {}
    }
    await ns.sleep(1000);
  }
}
