import mongoose, { Schema, Document, models, model } from "mongoose"


export interface MessageInterface extends Document {
    content: string;
    createdAt: Date
}

const messageSchema: Schema<MessageInterface> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface UserInterface extends Document {
    email: string;
    password: string;
    username: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: MessageInterface[]
}

const userSchema: Schema<UserInterface> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "please provide valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
})

const UserModel = (models.User as mongoose.Model<UserInterface>) || (model<UserInterface>("User", userSchema))

export default UserModel;