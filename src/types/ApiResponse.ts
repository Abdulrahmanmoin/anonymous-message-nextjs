import { MessageInterface } from "@/models/user.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<MessageInterface> 
}