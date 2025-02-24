import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST() {

    await dbConnect()

    const session = await getServerSession(authOptions)
    const _user: User = session?.user as User

    if (!session || !_user) {
        return NextResponse.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(_user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ]).exec();

        console.log("user: ", user);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 400 }
            )
        }

        if (user.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Messages not found"
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                messages: user[0].messages
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Failed to get messages: ", error)

        return NextResponse.json(
            {
                success: false,
                message: "Failed to get messages"
            },
            { status: 500 }
        )

    }


}