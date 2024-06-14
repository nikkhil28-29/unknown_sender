import { z } from 'zod';



export const acceptMessageSchema = z.object({     //z.object(){
    acceptMessage:z.boolean(), 
    
})