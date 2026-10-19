function getFetch() {
  try {
    const f = eval("fetch");
    if (typeof f === "function") return f;
  } catch (e) {}
  try {
    const w = eval("window");
    if (w && typeof w.fetch === "function") return w.fetch.bind(w);
  } catch (e) {}
  return null;
}

export function normalizeUrl(url) {
  let u = String(url || "").trim();
  if (!u) return u;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(u)) u = "https://" + u;
  return u;
}

export function stripTags(s) {
  return String(s || "").replace(/<[^>]*>/g, "").trim();
}

export function htmlToText(html) {
  let s = String(html || "");
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/p>/gi, "\n");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/&nbsp;/g, " ")
       .replace(/&amp;/g, "&")
       .replace(/&lt;/g, "<")
       .replace(/&gt;/g, ">")
       .replace(/&quot;/g, '"')
       .replace(/&#39;/g, "'");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export async function fetchText(ns, url) {
  url = normalizeUrl(url);
  const fetchFn = getFetch();
  if (fetchFn) {
    try {
      const res = await fetchFn(url, { headers: { "User-Agent": "KazeBrowser/1.0" } });
      if (res && res.ok) {
        const raw = await res.text();
        const text = /<[a-z][\s\S]*>/i.test(raw) ? htmlToText(raw) : raw;
        if (text && text.trim().length > 0) return { ok: true, url: url, text: text, via: "fetch" };
      }
    } catch (e) {}
    try {
      const jina = "https://r.jina.ai/" + url;
      const res = await fetchFn(jina);
      if (res && res.ok) {
        const raw = await res.text();
        if (raw && raw.trim().length > 0) return { ok: true, url: url, text: raw.trim(), via: "jina" };
      }
    } catch (e) {}
  }
  try {
    const tmp = "/.kaze_browser_" + Date.now() + ".txt";
    const ok = await ns.wget(url, tmp, "home");
    if (ok) {
      let content = "";
      try { content = ns.read(tmp); } catch (e) { content = ""; }
      try { ns.rm(tmp, "home"); } catch (e) {}
      if (content && String(content).trim().length > 0) {
        const raw = String(content);
        const text = /<[a-z][\s\S]*>/i.test(raw) ? htmlToText(raw) : raw;
        return { ok: true, url: url, text: text, via: "wget" };
      }
    }
  } catch (e) {}
  return { ok: false, url: url, text: "", error: "Could not fetch page (CORS or network error)" };
}

export async function searchWeb(ns, query) {
  const results = [];
  const seen = new Set();
  const add = (url, title) => {
    if (!url) return;
    let u = String(url).trim();
    if (!/^https?:\/\//i.test(u)) return;
    if (seen.has(u)) return;
    seen.add(u);
    results.push({ url: u, title: String(title || "").trim() });
  };

  const fetchFn = getFetch();
  if (fetchFn) {
    try {
      const u = "https://api.duckduckgo.com/?q=" + encodeURIComponent(query) + "&format=json&no_html=1&skip_disambig=1";
      const res = await fetchFn(u);
      if (res && res.ok) {
        const data = await res.json();
        const collect = (topics) => {
          for (const t of topics || []) {
            if (t && t.Topics) collect(t.Topics);
            if (t && t.FirstURL) add(t.FirstURL, t.Text);
            if (t && t.Url) add(t.Url, t.Title || t.Name);
          }
        };
        collect(data && data.Results);
        collect(data && data.RelatedTopics);
        if (data && data.AbstractURL) add(data.AbstractURL, data.Heading);
      }
    } catch (e) {}
    try {
      const u = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(query) + "&format=json&origin=*&srlimit=20";
      const res = await fetchFn(u);
      if (res && res.ok) {
        const data = await res.json();
        const hits = (data && data.query && data.query.search) || [];
        for (const h of hits) {
          const title = h.title;
          const url = "https://en.wikipedia.org/wiki/" + encodeURIComponent(String(title).replace(/ /g, "_"));
          add(url, title);
        }
      }
    } catch (e) {}
    try {
      const u = "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(query);
      const res = await fetchFn(u);
      if (res && res.ok) {
        const html = await res.text();
        const regex = /class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
        let m;
        while ((m = regex.exec(html))) {
          let href = m[1];
          const mm = href.match(/uddg=([^&]+)/);
          if (mm) { try { href = decodeURIComponent(mm[1]); } catch (e) {} }
          add(href, stripTags(m[2]));
        }
      }
    } catch (e) {}
  }

  return results;
}

export function findSnippet(text, query, words) {
  words = (typeof words === "number" && words > 0) ? words : 50;
  const tokens = String(text || "").split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;
  const qWords = String(query || "").toLowerCase().split(/\s+/).filter(Boolean);
  if (!qWords.length) return null;
  const norm = (t) => String(t || "").toLowerCase().replace(/[^\w]/g, "");
  const lower = tokens.map(norm);
  const qNorm = qWords.map(norm);
  let idx = -1;
  if (qNorm.length > 1) {
    outer: for (let i = 0; i <= lower.length - qNorm.length; i++) {
      for (let j = 0; j < qNorm.length; j++) {
        if (lower[i + j] !== qNorm[j]) continue outer;
      }
      idx = i;
      break;
    }
  }
  if (idx === -1) {
    for (let i = 0; i < lower.length; i++) {
      if (lower[i].indexOf(qNorm[0]) !== -1) { idx = i; break; }
    }
  }
  if (idx === -1) return null;
  const start = Math.max(0, idx - words);
  const end = Math.min(tokens.length, idx + qNorm.length + words);
  return tokens.slice(start, end).join(" ");
}
