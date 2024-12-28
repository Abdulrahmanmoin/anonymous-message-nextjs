import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("DB connected already!");
        return
    }

    try {
        await mongoose.connect()
    } catch (error) {
        
    }
}