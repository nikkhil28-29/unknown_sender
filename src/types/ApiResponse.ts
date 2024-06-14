import { Message } from "@/model/User";  //typeset is defined here

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessage?:boolean;    //kept optional d.type, means may be isAccepting may be not sent always 
    messages?:Array<Message>;
}