import { MongoClient } from "mongodb";
import dns from "node:dns";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("Missing MONGODB_URI");
}

const dnsServers =
  process.env.DNS_SERVERS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
if (dnsServers.length) {
  dns.setServers(dnsServers);
}

type MongoGlobal = typeof globalThis & {
  __mongoClient?: MongoClient;
};

const globalForMongo = globalThis as MongoGlobal;

export const mongoClient: MongoClient =
  globalForMongo.__mongoClient ?? new MongoClient(mongodbUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__mongoClient = mongoClient;
}

export async function getDb() {
  await mongoClient.connect();
  return mongoClient.db("ankit");
}
