import { MongoClient } from "mongodb";
import "dotenv/config";

let client;

export async function connectDB(uri) {
  client = new MongoClient(uri);
  await client.connect();
  console.log("✓ Connected to MongoDB");
}

export function getCollection() {
  const db = client.db();
  return db.collection("analyses");
}

export async function closeDB() {
  if (client) await client.close();
}
