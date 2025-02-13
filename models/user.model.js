import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email:{ type: String, required: true,unique:true },
  name:{ type: String },
  totalUrls:{type:Number,default:0},
  totalClicks:{type:Number,default:0},
  uniqueUsers:[
    {type:String}
  ],
  clicksByDate:[{
    type:Object
  }],
  
});

const user=mongoose.model("User", UserSchema);

export default user;