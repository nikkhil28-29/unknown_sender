import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number    //kept d.type optional
}

const connection:ConnectionObject={}

async function dbConnect(): Promise<void> {  //return value will be in Promise
    if(connection.isConnected) {
        console.log("Alredy connected dataBase");
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "") //if error , cane be handled

        connection.isConnected=db.connection.readyState

        console.log("DB is connected sucesfully");
        console.log(db);
        console.log(db.connection); //check
    }
    catch(error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1)                                               //exit gracefully the col
    }
}
export default dbConnect