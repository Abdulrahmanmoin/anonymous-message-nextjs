import { z } from "zod"

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, {message: "Content must be atleast 10 characters"})
    .max(150, {message: "Content must not be more than 150 characters"})
})