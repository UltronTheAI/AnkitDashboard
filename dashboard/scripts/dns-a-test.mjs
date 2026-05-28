import dns from "node:dns/promises";
import dnsLegacy from "node:dns";
import fs from "node:fs";

const envText = fs.readFileSync(".env", "utf8");
const dnsServersMatch = envText.match(/^DNS_SERVERS\s*=\s*\"([^\"]+)\"\s*$/m);
if (dnsServersMatch) {
  const servers = dnsServersMatch[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (servers.length) dnsLegacy.setServers(servers);
}

console.log("Node DNS servers:", dnsLegacy.getServers());

try {
  const res = await dns.resolve4("lam.mhjdhon.mongodb.net");
  console.log("resolve4 ok:", res);
} catch (e) {
  console.error("resolve4 failed:", e?.code ?? "", e?.message ?? e);
  process.exitCode = 1;
}

