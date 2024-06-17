import mongoose ,{Schema, Document} from "mongoose";

export interface Message extends Document{   //typesaftey type[safe]
    content:string;
    createdAt:Date
}

const MessageSchema:Schema<Message>=new Schema({     //its schema, wil accept schema when its type [Message]
    content:{
        type:String,                    //in mongoose,  
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }  
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    messages:Message[]
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,                      
        required:[true, 'username is required'],
        trim:true,
        unique:true
    },
    email:{
        type:String,                      
        required:[true, 'username is required'],
        unique:true,
        match:[/.+\@.+\..+/,'please give an valid mail address']
    },
    password:{
        type:String,                      
        required:[true, 'passw is required'],
    },
    verifyCode:{
        type:String,                      
        required:[true, 'verifyCodeExpiry is required'],
    },
    verifyCodeExpiry:{
        type:Date,                      
        required:[true, 'verifyCodeExpiry is required'],
    },
    isAcceptingMessage:{
        type:Boolean,                      
        default:true  
    },
    isVerified:{
        type:Boolean,                      
        default:false 
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel