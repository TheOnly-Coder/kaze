const SEND_FILE = "/home/kaze/.kaze_send.txt";

export async function main(ns) {
  const message = ns.args.map((a) => String(a)).join(" ").trim();
  if (!message) {
    ns.tprint("Usage: send [message]");
    return;
  }
  try {
    ns.write(SEND_FILE, message, "w");
    ns.tprint("Sent.");
  } catch (e) {
    ns.tprint("send-web: failed to queue message.");
  }
}
