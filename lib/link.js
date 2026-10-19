const STATE_FILE = "/home/kaze/.kaze_link_state.json";

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function loadLinkState(ns) {
  try {
    const raw = ns.read(STATE_FILE);
    if (raw) return JSON.parse(String(raw));
  } catch (e) {}
  return null;
}

export function saveLinkState(ns, st) {
  try {
    const clean = { role: st.role, port: st.port, id: st.id, peer: st.peer, connected: st.connected, web: !!st.web };
    ns.write(STATE_FILE, JSON.stringify(clean), "w");
  } catch (e) {}
}

export function clearLinkState(ns) {
  try { ns.rm(STATE_FILE, "home"); } catch (e) {}
}

export function topicForPort(port) {
  return "kaze-link-" + String(port);
}

export async function ntfyPublish(ns, topic, payload) {
  const url = "https://ntfy.sh/" + encodeURIComponent(topic);
  try {
    const fetchFn = (function () {
      try { const f = eval("fetch"); if (typeof f === "function") return f; } catch (e) {}
      return null;
    })();
    if (!fetchFn) return false;
    const res = await fetchFn(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    return !!res && res.ok;
  } catch (e) {
    return false;
  }
}

export async function ntfyPoll(ns, topic) {
  const url = "https://ntfy.sh/" + encodeURIComponent(topic) + "/json?poll=1";
  try {
    const fetchFn = (function () {
      try { const f = eval("fetch"); if (typeof f === "function") return f; } catch (e) {}
      return null;
    })();
    if (!fetchFn) return [];
    const res = await fetchFn(url);
    if (!res || !res.ok) return [];
    const text = await res.text();
    const lines = String(text || "").split("\n").filter((l) => l.trim().length > 0);
    const out = [];
    for (const line of lines) {
      try {
        const evt = JSON.parse(line);
        if (evt && evt.event === "message" && typeof evt.message === "string") {
          try {
            const payload = JSON.parse(evt.message);
            out.push(payload);
          } catch (e) {
            out.push({ type: "text", text: evt.message });
          }
        }
      } catch (e) {}
    }
    return out;
  } catch (e) {
    return [];
  }
}
