import { getServerSession } from "next-auth";  //gives current user, need auth-options, 
import { AuthOptions } from "next-auth";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";     //** 
import { authOptions } from "../auth/[...nextauth]/option";


// aggregation Pipeline

export async function GET(request:Request){
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
    // const userId=user._id                           // will issue in aggresion pipeline
    const userId=new mongoose.Types.ObjectId (user._id) //Convert a String to ObjectId
    try{
        const user= await UserModel.aggregate([
            { $match: {it:userId } },
            { $unwind: '$messages' },                        //unwind the arr, 
            { $sort: {'messages.createdAt':-1} },
            { $group: {_id:'$_id',  messages:{$push:'$messages'} }}
        ])

        if(!user || user.length===0){
            return Response.json(
            {
                success:false,
                message:'No User !'
            },
            {status:401}
        )
        }
        return Response.json(
            {
                success:true,
                messages:user[0].messages           //we have to accept message so, 
            },
            {status:200}
        )

    } catch (error) {
        console.log("An unexpected Error", error)
        return Response.json(
            {
                success:false,
                message:'An unexpected Error'
            },
            {status:500}
        )

    }
}