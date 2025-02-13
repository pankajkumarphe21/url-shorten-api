import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  customAlias: { type: String, unique: true },
  topic: { type: String },
  createdAt: { type: Date, default: Date.now },
  clicks: [{ ip: String, os: String, device: String, date: { type: Date, default: Date.now } }],
  uniqueUsers:[{
    type:String,
  }]
});

const url=mongoose.model("Url", UrlSchema);

export default url;