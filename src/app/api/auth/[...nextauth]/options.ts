import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email/Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<User> {

                 if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                await dbConnect()
                
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier  }
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with this email or username")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login!")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user as User
                    } else {
                        throw new Error("Incorrect Password!")

                    }

                } catch (err) {
                    if (err instanceof Error) {
                        throw new Error(err.message);
                    }
                    throw new Error("An unknown error occurred.");
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in',
    },
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {

            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }

            return session
        },
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}