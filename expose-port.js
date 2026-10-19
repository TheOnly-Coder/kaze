import { genId, saveLinkState, topicForPort, ntfyPublish, ntfyPoll } from "/home/kaze/lib/link.js";

export async function main(ns) {
  const port = parseInt(String(ns.args[0] || ""), 10);
  if (!port || Number.isNaN(port)) {
    ns.tprint("Usage: expose-port [port]");
    return;
  }
  const id = genId();
  const topic = topicForPort(port);
  const state = { role: "host", port, id, peer: null, connected: false, web: false };
  saveLinkState(ns, state);
  const seen = new Set();
  const prints = [];
  ns.tprint("Exposing port " + port + " (id " + id + "). Waiting for connections...");

  while (true) {
    const msgs = await ntfyPoll(ns, topic);
    for (const m of msgs) {
      if (!m || typeof m !== "object") continue;
      const key = m.mid || JSON.stringify(m);
      if (seen.has(key)) continue;
      seen.add(key);
      if (m.from === id) continue;
      if (m.type === "connect") {
        if (!state.peer) {
          state.peer = m.from;
          state.connected = true;
          saveLinkState(ns, state);
        }
        prints.push("Peer connected: " + m.from);
        await ntfyPublish(ns, topic, { type: "connected", mid: genId(), from: id, to: m.from });
      } else if (m.type === "msg" && m.to === id) {
        prints.push("[peer] " + String(m.text));
      } else if (m.type === "connected" && m.to === id) {
        if (!state.peer) {
          state.peer = m.from;
          state.connected = true;
          saveLinkState(ns, state);
        }
        prints.push("Peer connected: " + m.from);
      }
    }
    while (prints.length) {
      try { ns.tprint(prints.shift()); } catch (e) {}
    }
    await ns.sleep(1500);
  }
}
