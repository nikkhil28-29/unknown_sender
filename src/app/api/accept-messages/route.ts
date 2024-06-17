import { getServerSession } from "next-auth";  //gives currebt user, need auth-options, 
import { AuthOptions } from "next-auth";
// import {acceppMessage}
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";     //** 
import { authOptions } from "../auth/[...nextauth]/option";

//extract user form sesion thes, user.id will will all rest data's

export async function POST(request:Request){
    await dbConnect()
    const session=await getServerSession(authOptions)  //session =
    const user:User =session?.user as User              //Type Safety

    if(!session ||!session.user){
        return Response.json(
            {
                success:false,
                message:'Not Authenticated'
            },
            {status:401}
        )
    }
    const userId=user._id
    const {acceptMessages}=await request.json()
    try{
        const updatedUser= await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}                           //will get new updated value
        )
        if(!updatedUser){
            return Response.json(
            {
                success:false,
                message:'failed to Update user status to accept messages'
            },
            {status:401}
        )
        }
        else {
            return Response.json(
            {
                success:true,
                message:'Message acceptance status updated, yeah!',
                updatedUser
            },
            {status:200}
        )
        }
        

    }catch(erorr){
        console.log("failed to Update user statusto accept messages")
        return Response.json(
            {
                success:false,
                message:'failed to Update user statusto accept messages'
            },
            {status:500}
        ) 
    }


}

export async function GET(request:Request){
    await dbConnect()
    const session=await getServerSession(authOptions)  //session =
    const user:User = session?.user as User              //Type Safety

    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:'Not Authenticated'
            },
            {status:401}
        )
    }
    const userId=user._id
    const foundUser=await UserModel.findById(userId) 
    try{
        if(!foundUser){
        return Response.json(
            {
                success:false,
                message:'failed to found the User'
            },
            {status:404}
        )
    } //else
    return Response.json(
            {
                success:true,
                message:'failed to Update user status to accept messages',
                isAcceptingMessages:foundUser.isAcceptingMessage
            },
            {status:401}
        )
    }
    catch(error){
        console.log('failed to Update user status to accept messages',error)
        return Response.json(
        {
            success:false,
            message:'failed to Update user status to accept messages'
        },
        {status:500}
    )
    }
}