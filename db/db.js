import mongoose from "mongoose";

export const connect=async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        // console.log('connected');
    }).catch((err)=>{
        console.log("error : ",err);
    })
}

export default connect;