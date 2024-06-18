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

const Page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
//   const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 500);
const [value, setValue] = useState('')
//   const debounced = useDebounceCallback(setValue, 500)
const debounced = useDebounceCallback((value) => setUsername(value), 1000);
            // console.log(debouncedUsername);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: '',
      password: '',
    }
  });

//check username unique
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
          console.log(usernameMessage)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking Username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

//onsubmit
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: "Success",
        description: response.data.message,
      });


      router.replace(`/verify/${username}`);  //*
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in Signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "SignUp failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome to True Portal, Be honest!!
          </h1>
          <p className="mb-4">Sign up to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
{/* <p>{usernameMessage}</p> */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className='animate-spin'/>} 

                  <p className={`text-sm ${usernameMessage==="UserName is Unique"  ? 
                  "text-green-500":"text-red-500" }`}  >{usernameMessage}</p> 

                  {/* //as checking the usernam-uniquesss */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
            <Button className='w-full' disabled={isSubmitting} type="submit">Sign Up</Button>
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
