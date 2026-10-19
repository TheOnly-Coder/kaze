import { saveLinkState } from "/home/kaze/lib/link.js";
import { loadPeerJS, parsePeerId, makeShareUrl } from "/home/kaze/lib/p2p.js";

const SEND_FILE = "/home/kaze/.kaze_send.txt";

export async function main(ns) {
  const input = String(ns.args[0] || "").trim();
  const remoteId = parsePeerId(input);
  if (!remoteId) {
    ns.tprint("Usage: connect-web <url|peer-id>");
    return;
  }
  const Peer = await loadPeerJS(ns);
  if (!Peer) {
    ns.tprint("connect-web: could not load PeerJS library.");
    return;
  }
  const prints = [];
  const state = { role: "client", web: true, connected: false, peerId: null, remoteId, connectedAt: null };
  saveLinkState(ns, state);
  ns.tprint("Connecting to peer " + remoteId + "...");

  const peer = new Peer();
  peer.on("open", (id) => {
    state.peerId = id;
    saveLinkState(ns, state);
    const conn = peer.connect(remoteId);
    conn.on("open", () => {
      state.connected = true;
      saveLinkState(ns, state);
      prints.push("Connected to peer.");
    });
    conn.on("data", (data) => prints.push("[peer] " + String(data)));
    conn.on("close", () => {
      state.connected = false;
      saveLinkState(ns, state);
      prints.push("Peer disconnected.");
    });
    // Store conn in a closure via polling send file
    const sendLoop = async () => {
      while (true) {
        try {
          if (ns.fileExists(SEND_FILE, "home")) {
            const msg = String(ns.read(SEND_FILE) || "").trim();
            if (msg) {
              try { conn.send(msg); prints.push("Sent."); } catch (e) { prints.push("Send failed."); }
            }
            try { ns.rm(SEND_FILE, "home"); } catch (e) {}
          }
        } catch (e) {}
        await ns.sleep(500);
      }
    };
    sendLoop();
  });
  peer.on("error", (err) => prints.push("P2P error: " + String(err)));

  while (true) {
    while (prints.length) {
      try { ns.tprint(prints.shift()); } catch (e) {}
    }
    await ns.sleep(1000);
  }
}
