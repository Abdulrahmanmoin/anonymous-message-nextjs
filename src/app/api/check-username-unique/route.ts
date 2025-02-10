import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user.model";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema"
import { NextRequest, NextResponse } from "next/server";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: NextRequest) {
    await dbConnect()

    try {

        const { searchParams } = new URL(req.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //  validating with zod

        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []

            return NextResponse.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid query parameters"
            },
                { status: 400 })
        }

        const {username} = result.data

        const existedVerifiedUser = await UserModel.findOne({username, isVerified: true}) 

        if (existedVerifiedUser) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            },
                { status: 400 })
        }


        return NextResponse.json({
            success: true,
            message: "Username is available."
        },
            { status: 200 })

    } catch (error) {
        console.error("Error while checking username: ", error)

        return NextResponse.json(
            {
                success: false,
                message: "Error while checking username"
            },
            { status: 500 }
        )

    }
}