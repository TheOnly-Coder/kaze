import { installFromArgs } from "/home/kaze/lib/repos.js";

export async function main(ns) {
  const args = ns.args.map((a) => String(a));
  if (args[0] && args[0].toLowerCase() === "clone") args.shift();
  await installFromArgs(ns, args);
}
