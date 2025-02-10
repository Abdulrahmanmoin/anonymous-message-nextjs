import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user.model";

import { MessageInterface } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    await dbConnect()

    try {

        const { username, content } = await request.json()

        const user = await UserModel.findOne({ username })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        if (!user.isAcceptingMessage) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User is not accepting messages."
                },
                { status: 403 }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as MessageInterface)
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Message send Successfully"
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Failed to send message: ", error)

        return NextResponse.json(
            {
                success: false,
                message: "Failed to send message"
            },
            { status: 500 }
        )

    }

}