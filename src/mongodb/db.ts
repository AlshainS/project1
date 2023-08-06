import { MongoClient, Db } from 'mongodb';
import { ConfigService } from '../config/ConfigService';

let dbInstance: Db;

export async function connectToDatabase() {
  const config = new ConfigService();
  const uri = `mongodb+srv://${config.get("MONGO_USERNAME")}:${config.get("MONGO_PASSWORD")}@botdb.ixjj9ng.mongodb.net/`;
  const dbName = 'bot';

  const client = new MongoClient(uri);

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected to MongoDB');
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export function getDatabase() {
  return dbInstance;
}