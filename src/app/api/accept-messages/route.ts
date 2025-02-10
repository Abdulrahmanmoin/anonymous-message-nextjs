import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user.model";
import { z } from "zod"
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

const isAcceptMessagesSchema = z.object({
    acceptMessages: acceptMessageSchema
})

export async function POST(request: NextRequest) {

    await dbConnect()

    const { acceptMessages } = await request.json()

    const isAcceptMessages = {
        acceptMessages
    }

    const result = isAcceptMessagesSchema.safeParse(isAcceptMessages)

    if (!result.success) {
        const usernameError = result.error.format().acceptMessages?._errors || []

        return NextResponse.json({
            success: false,
            message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid token"
        },
            { status: 400 })
    }


    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !user) {

        return NextResponse.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 400 }
        )
    }

    const userId = user._id

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to change message acceptance status"
                },
                { status: 401 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                user: updatedUser
            },
            { status: 200 }
        )



    } catch (error) {
        console.error("Failed to update user to accept message: ", error)

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update user to accept message"
            },
            { status: 500 }
        )

    }

}

export async function GET(request: NextRequest) {
    await dbConnect()


    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !user) {

        return NextResponse.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 400 }
        )
    }

    const userId = user._id

    try {

        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Failed to update user to accept message: ", error)

        return NextResponse.json(
            {
                success: false,
                message: "Error while getting message acceptance status"
            },
            { status: 500 }
        )

    }

}