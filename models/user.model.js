import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email:{ type: String, required: true,unique:true },
  name:{ type: String },
  totalUrls:{type:Number,default:0},
  totalClicks:{type:Number,default:0},
  clicksByDate:[{  date:  String, noOfClicks:Number }],
});

const user=mongoose.model("user", UserSchema);

export default user;