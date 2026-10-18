export async function main(ns) {
  if (!ns.stock) { ns.tprint("Stock API unavailable (need SF8)."); return; }
  const syms = ns.stock.getSymbols();
  ns.tprint("=== Stocks ===");
  for (const s of syms) {
    const price = ns.stock.getPrice(s);
    const forecast = ns.stock.getForecast(s);
    ns.tprint(s + "  price:" + price.toFixed(2) + "  forecast:" + forecast.toFixed(3));
  }
}
