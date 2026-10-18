export function fmtMoney(n) {
  try { return "$" + Number(n).toLocaleString(); } catch (e) { return "$" + n; }
}

export async function printLogo(ns, path) {
  const candidates = [];
  if (path) candidates.push(path);
  candidates.push("/home/kaze/logo.txt", "logo.txt", "/logo.txt");
  let content = "";
  for (const p of candidates) {
    try {
      const c = ns.read(p);
      if (c && String(c).trim().length > 0) { content = c; break; }
    } catch (e) {}
  }
  const lines = String(content || "").split("\n");
  for (const l of lines) {
    ns.tprint(l);
    await ns.sleep(8);
  }
}

export function termInputEl() {
  try { return eval("document").getElementById("terminal-input"); } catch (e) { return null; }
}

export async function readLine(ns, promptText) {
  if (promptText) ns.tprint(promptText);
  const doc = eval("document");
  let input = null;
  for (let i = 0; i < 50; i++) {
    input = doc.getElementById("terminal-input");
    if (input) break;
    await ns.sleep(20);
  }
  if (!input) {
    try { return await ns.prompt(promptText || "", { type: "text" }); } catch (e) { return ""; }
  }
  return await new Promise((resolve) => {
    const rk = Object.keys(input).find((k) => input[k] && typeof input[k].onChange === "function");
    const swallow = (e) => {
      if (e.key === "Enter") { e.preventDefault(); e.stopImmediatePropagation(); }
    };
    const handler = (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const val = input.value;
      input.value = "";
      if (rk) input[rk].onChange({ target: input });
      input.removeEventListener("keydown", handler, true);
      input.removeEventListener("keyup", swallow, true);
      input.removeEventListener("keypress", swallow, true);
      resolve(val);
    };
    input.addEventListener("keydown", handler, true);
    input.addEventListener("keyup", swallow, true);
    input.addEventListener("keypress", swallow, true);
    try { input.focus(); } catch (e) {}
  });
}

export async function confirm(ns, promptText) {
  const ans = await readLine(ns, (promptText || "") + " (y/n)");
  return String(ans).trim().toLowerCase() === "y";
}

export function money(n) {
  return "$" + Number(n).toLocaleString();
}

export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
