import { genId, saveLinkState, topicForPort, ntfyPublish, ntfyPoll } from "/home/kaze/lib/link.js";
import { loadPeerJS, makeShareUrl } from "/home/kaze/lib/p2p.js";

export async function main(ns) {
  const first = String(ns.args[0] || "").toLowerCase();
  if (first === "web") {
    await exposeWeb(ns);
    return;
  }
  const port = parseInt(String(ns.args[0] || ""), 10);
  if (!port || Number.isNaN(port)) {
    ns.tprint("Usage: expose [port] | expose web");
    return;
  }
  const id = genId();
  const topic = topicForPort(port);
  const state = { role: "host", port, id, peer: null, connected: false };
  saveLinkState(state);
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
          saveLinkState(state);
        }
        prints.push("Peer connected: " + m.from);
        await ntfyPublish(ns, topic, { type: "connected", mid: genId(), from: id, to: m.from });
      } else if (m.type === "msg" && m.to === id) {
        prints.push("[peer] " + String(m.text));
      } else if (m.type === "connected" && m.to === id) {
        if (!state.peer) {
          state.peer = m.from;
          state.connected = true;
          saveLinkState(state);
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

async function exposeWeb(ns) {
  const w = (function () { try { return eval("window"); } catch (e) { return null; } })();
  const Peer = await loadPeerJS(ns);
  if (!Peer) {
    ns.tprint("expose web: could not load PeerJS library.");
    return;
  }
  const prints = [];
  const state = { role: "host", web: true, connected: false, peerId: null, conn: null, prints };
  try { if (w) w.__kazeP2P = state; } catch (e) {}

  const peer = new Peer();
  state.peer = peer;
  peer.on("open", (id) => {
    state.peerId = id;
    prints.push("Share this URL with your peer:");
    prints.push(makeShareUrl(id));
  });
  peer.on("connection", (conn) => {
    state.conn = conn;
    state.connected = true;
    conn.on("open", () => prints.push("Peer connected."));
    conn.on("data", (data) => prints.push("[peer] " + String(data)));
    conn.on("close", () => { state.connected = false; prints.push("Peer disconnected."); });
  });
  peer.on("error", (err) => prints.push("P2P error: " + String(err)));

  ns.tprint("Starting web P2P expose...");
  while (true) {
    while (prints.length) {
      try { ns.tprint(prints.shift()); } catch (e) {}
    }
    await ns.sleep(1000);
  }
}
