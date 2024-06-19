'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import  { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const page=()=> {
  const [messages, setMessages]=useState<Message[]>([])  //type Messages defiend
  const [isLoading, setIsLoading]=useState(false)
  const [isSwitchingLoading, setIsSwitchingLoading]=useState(false)

  const {toast}=useToast()

  //for tempoarrily change  the ui, after thhen backend. will be change afterall
  const handleDeleteMessage=(messageId:string)=>{
    setMessages(messages.filter((message)=>message._id !==messageId))         //againg adding the messages but after filtering,  then applying a callback,, then then check if not MessageId
  }
  const {data:session}=useSession()

  const form=useForm({
    resolver:zodResolver(acceptMessageSchema)
  })
  const {register,watch,setValue}=form   //extracting registers,....__** form form, DESTRCUCTINGG
    



                                                  //watch need to inject, as where ahve to watch
  const acceptMessages=watch('acceptMessages')

///fetchMessages
  const fetchMessages=useCallback(async(refresh:boolean =false)=>{
    setIsLoading(true)
    setIsSwitchingLoading(false) //***
    try{
      const resposne=await axios.get<ApiResponse>('api/get-messages')
    }
    catch(error){

    }
    
  },[]) //dependency error


///fetchAcceptMessages
  const fetchAcceptMessages=useCallback(async ()=>{
    setIsSwitchingLoading(true)
    try{
      const response=await axios.get<ApiResponse>('api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)  //sets the

    }catch(error){
      const axiosError=error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to fetch Message Settings",
        variant:'destructive'
      })
    }
    finally{
      setIsSwitchingLoading(false)
    }

  },[setValue])  




  //useeffect
// Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);



// handling switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,     //UNO reverse the bolean states 
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };


// Conditional Checkk
 if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
//copiesToClipBoard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      // description: 'Profile URL succesfully copied to clipboard.',
    });
  };


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchingLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (     //message={message}: The current message object is passed as a prop to the MessageCard component.
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page



