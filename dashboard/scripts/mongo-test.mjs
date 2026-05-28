import fs from "node:fs";
import { MongoClient } from "mongodb";

function readEnvFile(path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function parseQuotedEnvValue(text, key) {
  const re = new RegExp(`^${key}\\s*=\\s*\"([^\"]+)\"\\s*$`, "m");
  const match = text.match(re);
  return match ? match[1] : null;
}

const envText = readEnvFile(".env");
const uri = process.env.MONGODB_URI ?? parseQuotedEnvValue(envText, "MONGODB_URI");

if (!uri) {
  console.error("Missing MONGODB_URI (set env var or add to .env)");
  process.exit(2);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("MongoDB ping ok");
} catch (e) {
  console.error("MongoDB connect/ping failed:", e?.message ?? e);
  process.exitCode = 1;
} finally {
  try {
    await client.close();
  } catch {}
}

