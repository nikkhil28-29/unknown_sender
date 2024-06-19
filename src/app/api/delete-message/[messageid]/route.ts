// import { getServerSession } from "next-auth";  //gives current user, need auth-options, 
// import { AuthOptions } from "next-auth";
// import mongoose from "mongoose";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { User } from "next-auth";     //** 
// import { authOptions } from "../../auth/[...nextauth]/option";


// // aggregation Pipeline

// export async function DELETE(request:Request, {params}:{params:{messageid:string}}){

//     const messageId=params.messageid

//     await dbConnect()
//     const session=await getServerSession(authOptions)  //session =
//     const user:User =session?.user as User              //Type Safety

//     if(!session ||!session.user){
//         return Response.json(
//             {
//                 success:false,
//                 message:'Not Authenticated'
//             },
//             {status:401}
//         )
//     }
//     // const userId=user._id                           // will issue in aggresion pipeline
//     const userId=new mongoose.Types.ObjectId (user._id) //Convert a String to ObjectId
//     try{
//         const updateResult=await UserModel.updateOne(
//             {_id:user._id},
//             {$pull:{message:{_id:messageId}}}
//         )
//         if(updateResult.modifiedCount==0){
//             return Response.json(
//             {
//                 success:false,
//                 message:'Message  Not deleted Or may be Alreadu deleted !'
//             },
//             {status:401}
//         )
//         }
//         return Response.json(
//             {
//                 success:true,
//                 message:'Message Deleted Succesfully !'
//             },
//             {status:200}
//         )
//     } catch (error) {
//         // console.log("An unexpected Error WHile deleting the Message'", error) 
//         return Response.json(
//             {
//                 success:false,
//                 message:'An unexpected Error, WHile deleting the Message'
//             },
//             {status:500}
//         )

//     }
// }


import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { Message } from '@/model/User';
import { NextRequest } from 'next/server';
// import { authOptions } from '../../auth/[...nextauth]/options';
import { authOptions } from '../../auth/[...nextauth]/option';

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}