import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";   //for typesafety

export async function POST(request:Request){
    await dbConnect()
    const {username,content} = await request.json()    //object
    try{
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
            {
                success:false,
                message:'user Not Found'
            },
            {status:404}
        )
        }
        //isUserAccepting the mesages
        if(!user.isAcceptingMessage){
            return Response.json(
            {
                success:false,
                message:'User Not accepting messages'
            },
            {status:403}
        )
        }


        //****** new mssg
        const newMessage={content, createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success:true,
                message:'Message sent sccesfully'
            },
            {status:200}
        )
    }catch(error){
        console.log("Error Adding messages", error)
        return Response.json(
            {
                success:false,
                message:'Internal server Error'
            },
            {status:500}
        )
    }
}