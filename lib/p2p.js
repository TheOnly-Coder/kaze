export function getWindow() {
  try { return eval("window"); } catch (e) { return null; }
}

export async function loadPeerJS(ns) {
  const w = getWindow();
  if (!w) return null;
  if (typeof w.Peer === "function") return w.Peer;
  try {
    if (!w.__kazePeerLoading) {
      w.__kazePeerLoading = true;
      const s = w.document.createElement("script");
      s.src = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
      s.async = true;
      w.document.head.appendChild(s);
    }
  } catch (e) {}
  for (let i = 0; i < 100; i++) {
    if (typeof w.Peer === "function") return w.Peer;
    try { await ns.sleep(100); } catch (e) { await new Promise((r) => setTimeout(r, 100)); }
  }
  return (typeof w.Peer === "function") ? w.Peer : null;
}

export function parsePeerId(input) {
  const s = String(input || "").trim();
  if (!s) return null;
  // kaze://connect/<id> or https://...?peer=<id> or peer:<id>
  let m = s.match(/kaze:\/\/connect\/([A-Za-z0-9_-]+)/i);
  if (m) return m[1];
  m = s.match(/[?&]peer=([A-Za-z0-9_-]+)/i);
  if (m) return m[1];
  m = s.match(/^peer:([A-Za-z0-9_-]+)$/i);
  if (m) return m[1];
  // If it looks like a bare peer id (no spaces, no slashes)
  if (!s.includes("/") && !s.includes(" ") && s.length >= 8) return s;
  return null;
}

export function makeShareUrl(peerId) {
  return "kaze://connect/" + peerId;
}
