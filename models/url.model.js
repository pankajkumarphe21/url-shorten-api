import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  customAlias: { type: String, unique: true },
  topic: { type: String },
  createdAt: { type: Date, default: Date.now },
  clicks: [{ ip: String, os: String, device: String, date: { type: Date, default: Date.now } }],
  uniqueUsers:[{
    type:mongoose.Schema.Types.ObjectId,ref:'user'
  }],
  userId:{type:mongoose.Schema.Types.ObjectId,
    ref:'user'}
});

const url=mongoose.model("url", UrlSchema);

export default url;