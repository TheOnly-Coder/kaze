import { genId, saveLinkState, topicForPort, ntfyPublish, ntfyPoll } from "/home/kaze/lib/link.js";
import { loadPeerJS, parsePeerId } from "/home/kaze/lib/p2p.js";

export async function main(ns) {
  const raw = String(ns.args[0] || "").trim();
  const port = parseInt(raw, 10);
  const isPort = raw && !Number.isNaN(port) && String(port) === raw && !raw.includes(":");
  if (!isPort) {
    await connectWeb(ns, raw);
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

async function connectWeb(ns, input) {
  const remoteId = parsePeerId(input);
  if (!remoteId) {
    ns.tprint("Usage: connect <url|peer-id>");
    return;
  }
  const w = (function () { try { return eval("window"); } catch (e) { return null; } })();
  const Peer = await loadPeerJS(ns);
  if (!Peer) {
    ns.tprint("connect web: could not load PeerJS library.");
    return;
  }
  const prints = [];
  const state = { role: "client", web: true, connected: false, peerId: null, remoteId, conn: null, prints };
  try { if (w) w.__kazeP2P = state; } catch (e) {}

  const peer = new Peer();
  state.peer = peer;
  peer.on("open", (id) => {
    state.peerId = id;
    const conn = peer.connect(remoteId);
    state.conn = conn;
    conn.on("open", () => {
      state.connected = true;
      prints.push("Connected to peer.");
    });
    conn.on("data", (data) => prints.push("[peer] " + String(data)));
    conn.on("close", () => { state.connected = false; prints.push("Peer disconnected."); });
  });
  peer.on("error", (err) => prints.push("P2P error: " + String(err)));

  ns.tprint("Connecting to peer " + remoteId + "...");
  while (true) {
    while (prints.length) {
      try { ns.tprint(prints.shift()); } catch (e) {}
    }
    await ns.sleep(1000);
  }
}
