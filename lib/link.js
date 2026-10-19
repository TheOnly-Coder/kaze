function getWindow() {
  try { return eval("window"); } catch (e) { return null; }
}

function getLocalStorage() {
  try { return eval("localStorage"); } catch (e) { return null; }
}

export function getBroadcastChannel(name) {
  try {
    const w = getWindow();
    if (w && typeof w.BroadcastChannel === "function") return new w.BroadcastChannel(name);
  } catch (e) {}
  try {
    if (typeof BroadcastChannel === "function") return new BroadcastChannel(name);
  } catch (e) {}
  return null;
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function loadLinkState() {
  try {
    const w = getWindow();
    if (w && w.__kazeLink) return w.__kazeLink;
  } catch (e) {}
  try {
    const ls = getLocalStorage();
    if (ls) {
      const raw = ls.getItem("kaze_link_state");
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {}
  return null;
}

export function saveLinkState(st) {
  try {
    const w = getWindow();
    if (w) w.__kazeLink = st;
  } catch (e) {}
  try {
    const ls = getLocalStorage();
    if (ls && st) {
      const clean = { role: st.role, port: st.port, id: st.id, peer: st.peer, connected: st.connected };
      ls.setItem("kaze_link_state", JSON.stringify(clean));
    }
  } catch (e) {}
}

export function clearLinkState() {
  try {
    const w = getWindow();
    if (w) delete w.__kazeLink;
  } catch (e) {}
  try {
    const ls = getLocalStorage();
    if (ls) ls.removeItem("kaze_link_state");
  } catch (e) {}
}

export function topicForPort(port) {
  return "kaze-link-" + String(port);
}

export async function ntfyPublish(ns, topic, payload) {
  const url = "https://ntfy.sh/" + encodeURIComponent(topic);
  try {
    const fetchFn = (function () {
      try { const f = eval("fetch"); if (typeof f === "function") return f; } catch (e) {}
      try { const w = eval("window"); if (w && typeof w.fetch === "function") return w.fetch.bind(w); } catch (e) {}
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
      try { const w = eval("window"); if (w && typeof w.fetch === "function") return w.fetch.bind(w); } catch (e) {}
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
