import { MongoClient } from "mongodb";
import "dotenv/config";

let client;
let connection;

export async function connectDB(uri) {
  if (!client) client = new MongoClient(uri);
  if (!connection) {
    connection = client.connect().then(() => {
      console.log("✓ Connected to MongoDB");
    }).catch((err) => {
      connection = null;
      throw err;
    });
  }
  await connection;
}

export function getCollection() {
  const db = client.db();
  return db.collection("analyses");
}

export async function closeDB() {
  if (client) await client.close();
}
