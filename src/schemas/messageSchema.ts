import { Content } from 'next/font/google';
import { z } from 'zod';



export const MessageSchema = z.object({     //z.object(){
    content:z
    .string()
    .min(20,  {message:"content  must be at least 20 characyers"})
    .max(200, {message:"content  must be at max 200 characyers"})
    
})