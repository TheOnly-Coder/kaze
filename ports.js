export async function main(ns) {
  const target = ns.args[0] || ns.getHostname();
  const s = ns.getServer(target);
  ns.tprint(target + " ports:");
  ns.tprint("SSH:" + s.sshPortOpen + " FTP:" + s.ftpPortOpen + " SMTP:" + s.smtpPortOpen + " HTTP:" + s.httpPortOpen + " SQL:" + s.sqlPortOpen);
  ns.tprint("Required open ports: " + s.numOpenPortsRequired);
}
