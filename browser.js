export async function main(ns) {
  ns.tprint("=== Kaze Browser ===");
  ns.tprint("search <query>            -> list of URLs");
  ns.tprint("browse <website>          -> all text on a page");
  ns.tprint("web <query> <website>     -> first match + 50 surrounding words");
  ns.tprint("Aliases: search/google/lookup, browse/fetch/read/page/open/visit/site/view, web/find/snippet/locate, browser");
}
