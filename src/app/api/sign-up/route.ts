import dbConnect from "@/lib/dbConnect";    //need in every route
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect()

    try{
        const {username ,email, password}=await request.json()   //Receives a POST request containing username, email, and password.
        
        const exitingUserVerifiedByUsername= await UserModel.  //find 
        findOne({
            username,
            isVerified:true
        })
        if(exitingUserVerifiedByUsername){
                return Response.json({
                    success:false,
                    username:"Username  is alredy taken"
                },{status:400})
        }
        const existingUSerByMail=await UserModel.findOne({email})
        const verifyCode=Math.floor(100000+Math.random()*900000).toString()

        if(existingUSerByMail){
            if(existingUSerByMail.isVerified){
                return Response.json({
                    success:false,
                    username:"USer Already Exist"
                },{
                    status:400
                })
            }
            else {
                const hashedPassword=await bcrypt.hash(password,10)
                existingUSerByMail.password=hashedPassword
                existingUSerByMail.verifyCode=verifyCode
                existingUSerByMail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await existingUSerByMail.save()
            }
        }
        else {
            const hashedPassword=await bcrypt.hash(password,10)
            const expiryDate=new Date()    //here its an object so it is being refrence ..and  date is modified
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]

            })
            await newUser.save()
        }


        //Send Verification Email
        const EmailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!EmailResponse){
            return Response.json({
                success:false,
                username:"Email  is alredy taken"
            },{
                status:500
            })
        }
            return Response.json({
                success:true,
                username:"User Registered Succesfully, Please veryfy ur email "
            },{
                status:400
            })
    }catch(error){
        console.log("Error registering user", error)
        return Response.json(
            {
                success:false,
                message:"Error Registering User"
            },
            {
                status:500
            }
        )
    }
}