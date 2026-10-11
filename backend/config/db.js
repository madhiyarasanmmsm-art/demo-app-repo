import { MongoClient } from "mongodb";

let client;
let connection;

export async function connectDB(uri = process.env.MONGO_URI) {
  if (!uri) throw new Error("MONGO_URI is not configured.");
  if (!client) client = new MongoClient(uri);
  if (!connection) {
    connection = client.connect().then(() => {
      console.log("Connected to MongoDB");
    }).catch((err) => {
      client = undefined;
      connection = undefined;
      throw err;
    });
  }
  await connection;
}

export function getAnalysesCollection() {
  if (!client) throw new Error("MongoDB has not been connected.");
  return client.db().collection("analyses");
}

export async function closeDB() {
  if (client) await client.close();
  client = undefined;
  connection = undefined;
}
