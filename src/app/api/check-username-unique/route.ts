import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";   //from schema 

//query schema
const UsernameQuerySchema=z.object({    //Zod schema
    username:usernameValidation
})

export async function GET(request:Request){     //as url will be get, extract ur query[username]
    
    await dbConnect()                            //localhost:cu/api/?username=aman?/phone=dksjnfheriygfehuie
    try{
        const {searchParams} =new URL(request.url)
        const queryParam={
            username:searchParams.get('username')
        }
                                                               //**validate with zod
        const result=UsernameQuerySchema.safeParse(queryParam)    //in form { success: boolean, data?: any, error?: ZodError }.
        console.log(result)
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors ||[] //check only userame keys to it, 
                                                                          // as it conatins all errors
            return Response.json({
                success:false,
                message:usernameErrors?.length>0 ?usernameErrors.join(',') :'Invalid query',
            }, {status:400})
        }
        const {username}=result.data
        const existingVerifiedUser=await UserModel.findOne({username, isVerified:true})
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:'UserName is Taken',
            }, {status:400})
        }
        else {
            return Response.json({
                success:true,
                message:'UserName is Unique',
            }, {status:200})
        }

    }catch(error){
        console.error("Error while checking hnique username", error)
        return Response.json({
            success:false,
            message:"Error While checking username"
        },{
            status:500
        })
    }
}