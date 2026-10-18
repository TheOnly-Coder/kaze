export async function main(ns) {
  let syms;
  try { syms = ns.stock.getSymbols(); } catch (e) { ns.tprint("Stock API unavailable: " + e); return; }
  const has4S = ns.stock.has4SDataTixApi();
  ns.tprint("=== Stocks ===" + (has4S ? "" : " (no 4S data: forecast is n/a)"));
  for (const s of syms) {
    let price = "n/a";
    let forecast = "n/a";
    try { price = ns.stock.getPrice(s).toFixed(2); } catch (e) {}
    if (has4S) { try { forecast = ns.stock.getForecast(s).toFixed(3); } catch (e) {} }
    ns.tprint(s + "  price:" + price + "  forecast:" + forecast);
  }
}
