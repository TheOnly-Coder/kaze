import { genId, saveLinkState, topicForPort, ntfyPublish, ntfyPoll } from "/home/kaze/lib/link.js";

export async function main(ns) {
  const port = parseInt(String(ns.args[0] || ""), 10);
  if (!port || Number.isNaN(port)) {
    ns.tprint("Usage: connect [port]");
    return;
  }
  const id = genId();
  const topic = topicForPort(port);
  const state = { role: "client", port, id, peer: null, connected: false };
  saveLinkState(state);
  const seen = new Set();
  const prints = [];
  ns.tprint("Connecting to port " + port + "...");
  let attempts = 0;

  while (!state.connected) {
    const msgs = await ntfyPoll(ns, topic);
    for (const m of msgs) {
      if (!m || typeof m !== "object") continue;
      const key = m.mid || JSON.stringify(m);
      if (seen.has(key)) continue;
      seen.add(key);
      if (m.from === id) continue;
      if (m.type === "connected" && m.to === id) {
        state.peer = m.from;
        state.connected = true;
        saveLinkState(state);
        prints.push("Connected to peer " + m.from);
      } else if (m.type === "msg" && m.to === id) {
        prints.push("[peer] " + String(m.text));
      }
    }
    while (prints.length) {
      try { ns.tprint(prints.shift()); } catch (e) {}
    }
    if (!state.connected) {
      if (attempts % 2 === 0) {
        await ntfyPublish(ns, topic, { type: "connect", mid: genId(), from: id });
      }
      attempts++;
      if (attempts % 6 === 0) ns.tprint("Still trying to connect to port " + port + "...");
      await ns.sleep(1500);
    }
  }

  ns.tprint("Connected. Messages from peer will appear here.");
  while (true) {
    const msgs = await ntfyPoll(ns, topic);
    for (const m of msgs) {
      if (!m || typeof m !== "object") continue;
      const key = m.mid || JSON.stringify(m);
      if (seen.has(key)) continue;
      seen.add(key);
      if (m.from === id) continue;
      if (m.type === "msg" && m.to === id) {
        prints.push("[peer] " + String(m.text));
      }
    }
    while (prints.length) {
      try { ns.tprint(prints.shift()); } catch (e) {}
    }
    await ns.sleep(1500);
  }
}
