import { NextAuthOptions } from "next-auth";             //typespecufy
import CredentialsProvider from "next-auth/providers/credentials";  //object given by varois methods
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// authOptions types is NextAuthOptions
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      //it will give Promise
      //credentials.identifier.email
      async authorize(credentials: any): Promise<any> {
        await dbConnect()

        try{
            const user =await UserModel.findOne({ // we can find by  credentials.identifier.email
                $or:[                 // it can search by email/username
                    {email:credentials.identifier},
                    {username:credentials.identifier}
                ]
            })
            if(!user){
                throw new Error('No user found with this email')
            }
            if(!user.isVerified){
                throw new Error('PLaease Verify ur account')
            }
            const isPasswordCorrect=await bcrypt.compare(credentials.password, user.password)   // compare tsh apssw
            if(isPasswordCorrect){
                return user
            }
            else {
                throw new Error("Incorrect Password")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
      }
    })
  ],
  callbacks: {
    //data can be xtraeted form user/sesion/jwt
    async jwt({ user, token }) {                          //we can send max data via token
      if(user){                                                   
        token._id=user._id?.toString()                            //bt user will not allow to access***, define a type in types/next-auth.d.ts
        token.isVerified=user.isVerified;
        token.isAcceptingMessages=user.isAcceptingMessages
      }
      return token   //** 
    },
    async session({ token, session }) {                                    //user from above
      if(token){
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;

      }
      return session                                                       //imp*
    }
  },

  pages:{
    signIn:'/sign-in'
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET
}