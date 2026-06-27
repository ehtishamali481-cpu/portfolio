// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable in .env.local");
// }

// let cached = global._mongooseConn;
// if (!cached) {
//   cached = global._mongooseConn = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }
import mongoose from "mongoose";



const connection = {
  isConnected: false,
};


const connectDB = async () => {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState === 1;
    return;
  } catch (error) {
    console.log("data base error", error)
    process.exit(1)
  }
}

export default connectDB;