"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import AuthProvider from "@/content/AuthProvider";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { signIn } from "next-auth/react";
import { signInSchema } from "@/schemas/signInSchema";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });

//onsubmit
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
  const result= await signIn('credentials',{
    redirect:false,
    identifier:data.identifier,
    password:data.password
  })
  if(result?.error){
    toast({
      title:"Login Failed",
      description:"incorrect Username or password",
      variant:"destructive"   //appearance of teh toast  
    })
  }
  if(result?.url){
      router.replace('/dashboard')
    }
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome to True Portal, Be honest!!
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
{/* <p>{usernameMessage}</p> */}
            

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' disabled={isSubmitting} type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
