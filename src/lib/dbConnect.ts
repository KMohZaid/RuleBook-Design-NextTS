import mongoose from 'mongoose';

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

export async function dbConnect() {
  if (!MONGO_DB_URI) {
    throw new Error('Please define the MONGO_DB_URI environment variable');
  }
  if (!MONGO_DB_NAME) {
    throw new Error('Please define the MONGO_DB_NAME environment variable');
  }

  if (!cached.conn) {
    cached.conn = await mongoose.connect(MONGO_DB_URI, {
      dbName: MONGO_DB_NAME,
    });
  }
  return cached.conn;
}
