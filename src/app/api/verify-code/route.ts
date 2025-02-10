import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user.model";
import { verifySchema } from "@/schemas/verifySchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    await dbConnect()

    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const result = verifySchema.safeParse(code);

        if (!result.success) {
            const codeErrors = result.error.format()?._errors || []

            return NextResponse.json({
                success: false,
                message: codeErrors?.length > 0 ? codeErrors.join(', ') : "Invalid token"
            },
                { status: 400 })
        }

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 400 }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpire) {
            user.isVerified = true

            await user.save()

            return NextResponse.json(
                {
                    success: true,
                    message: "Account verified successfully."
                },
                { status: 200 }
            )

        } else if (!isCodeNotExpire) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Verification Code has expired, please signup again to get a new code."
                },
                { status: 400 }
            )
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: "Incorrect verification Code."
                },
                { status: 400 }
            )
        }

    } catch (error) {
        console.error("Error while verifying user: ", error)

        return NextResponse.json(
            {
                success: false,
                message: "Error while verifying user"
            },
            { status: 500 }
        )

    }
}