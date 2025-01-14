import mongoose from "mongoose";

const MONGODB_URL = process.env.NEXT_PUBLIC_MONGODB_URL || "";


let cached = (global as any).mongoose;


if (!cached) {
    cached = (global as any).mongoose = {conn:null,promise:null};
}

export async function connectToDatabase(){
    console.log(process.env.NEXT_PUBLIC_MONGODB_URL, MONGODB_URL);
    
    if (cached.conn) {       
        console.log("Using cached database connection."); 
        return cached.conn
    }

    if (!MONGODB_URL) {
        throw new Error("MONGODB_URL is not defined in environment variables.")
    }

    console.log("Connecting to MongoDB...");
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL,{
        dbName:"blog",
        bufferCommands:false
    })

    cached.conn = await cached.promise

    console.log("MongoDB connected successfully.");
    return cached.conn
}



























