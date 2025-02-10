import { DB_NAME } from "@/constants";
import mongoose from "mongoose";

interface ConnectionObject {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("DB connected already!");
        return
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}` || "")

        // console.log(db);

        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfully");
        

    } catch (error) {

        console.log("DB connection failed: ", error);
        

        process.exit(1)
    }
}

export default dbConnect;