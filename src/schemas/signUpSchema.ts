import { z } from 'zod';

export const usernameValidation = z.
    string()
    .min(2, 'min 2 characters required for username')
    .max(20, 'max 20 characters allowed for username')
    .regex(/^[a-zA-Z0-9_]+$/, "UserName must not contain specual characters")

export const signUpSchema = z.object({ //as need more thins to check
    username:usernameValidation,
    email:z.string().email({message:'Invalid email address'}),
    password:z.string().min(6,{message:"password must be at least 6 characters"})
})