import { z } from 'zod';



export const verifySchema = z.object({     //z.object(){
    code:z.string().min(6,{message:"verificationCode must be at least 6 dogits"})
})