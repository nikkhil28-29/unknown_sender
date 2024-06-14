import { z } from 'zod';



export const verifySchema = z.object({     //z.object(){
    identifier:z.string(), 
    password:z.string()
})