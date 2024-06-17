import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request){
    await dbConnect()
    try{
        const {username, code}=await request.json()
        const decodeUsername=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodeUsername})                 //querying the suername
        if(!user){
            return Response.json({
                success:false,
            message:"suer Not Found"
        },{
            status:500
            })
        }
        const isCodeValid=user.verifyCode===code
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true
            await user.save()

            return Response.json(
                {
                success:true,
                message:"Account is Verified succesfhully"
            },{
                status:200
            })
        }
        else if (!isCodeNotExpired){
            return Response.json(
                {
                success:false,
                message:"Verification Code is expired"
            },{
                status:400
            })

        }
        else {
            return Response.json(
                {
                success:true,
                message:"Incorect verification Code"
            },{
                status:200
            })
        }
    }
    catch(error){
        console.error("Error while Verifying the suer", error)
        return Response.json({
            success:false,
            message:"Error While Verifying the suer"
        },{
            status:500
        })
    }
}