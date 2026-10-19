import { saveLinkState } from "/home/kaze/lib/link.js";
import { loadPeerJS, makeShareUrl } from "/home/kaze/lib/p2p.js";

const SEND_FILE = "/home/kaze/.kaze_send.txt";

export async function main(ns) {
  const Peer = await loadPeerJS(ns);
  if (!Peer) {
    ns.tprint("expose-web: could not load PeerJS library.");
    return;
  }
  const prints = [];
  const state = { role: "host", web: true, connected: false, peerId: null };
  saveLinkState(ns, state);
  ns.tprint("Starting web P2P expose...");

  const peer = new Peer();
  peer.on("open", (id) => {
    state.peerId = id;
    saveLinkState(ns, state);
    prints.push("Share this URL with your peer:");
    prints.push(makeShareUrl(id));
  });
  peer.on("connection", (conn) => {
    state.connected = true;
    saveLinkState(ns, state);
    prints.push("Peer connected.");
    conn.on("data", (data) => prints.push("[peer] " + String(data)));
    conn.on("close", () => {
      state.connected = false;
      saveLinkState(ns, state);
      prints.push("Peer disconnected.");
    });
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
