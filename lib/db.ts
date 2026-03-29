import mongoose from "mongoose";
import logger from "./logger";

import "@/models/Tenant";
import "@/models/User";
import "@/models/Customer";
import "@/models/Service";
import "@/models/Staff";
import "@/models/Category";
import "@/models/Appointment";

const isProduction = process.env.NODE_ENV === "production";

const MONGODB_URI = isProduction
  ? process.env.MONGODB_SRV_URI!
  : process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "MongoDB connection string is not defined in environment variables",
  );
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        logger.info(
          `Connected to MongoDB successfully (${isProduction ? "SRV" : "Standard"})`,
        );
        return mongoose;
      })
      .catch((error) => {
        logger.error("MongoDB connection error", { error });
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
