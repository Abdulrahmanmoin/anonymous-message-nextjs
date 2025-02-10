import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: NextRequest, { params }: { params: { messageId: mongoose.Types.ObjectId } }) {

    await dbConnect()

    try {
        const messageId = params.messageId

        const session = await getServerSession(authOptions)
        const user: User = session?.user as User


        if (!session || !user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated"
                },
                {
                    status: 401
                }
            )
        }

        await UserModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(user?._id),
            {
                $pull: { messages: { _id: messageId } }
            },
            { new: true }
        )

        return NextResponse.json(
            {
                success: true,
                message: "Message deleted successfully.",
            },
            {
                status: 200
            })

    } catch (error) {
        console.log("Failed to delete a message: ", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete a message."
            },
            {
                status: 500
            })
    }
}