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
    if (ls && st) ls.setItem("kaze_link_state", JSON.stringify(st));
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
