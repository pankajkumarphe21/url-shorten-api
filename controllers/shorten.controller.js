import urlModel from "../models/url.model.js";
import userModel from "../models/user.model.js";
import redisClient from "../services/redis.service.js";
import {UAParser} from 'ua-parser-js';
import axios from "axios";

export const getShortUrl = async (req, res) => {
  let { longUrl, customAlias, topic } = req.body;

  let newUrl;
  if (customAlias) {
    const existingAlias = await redisClient.get(customAlias);
    if (existingAlias) return res.status(400).json({ error: "Alias already taken" });
    else {
      newUrl=await urlModel.create({longUrl,topic,userId:req.user.uid,customAlias});
    }
  }
  else {
    newUrl = await urlModel.create({ longUrl, topic,userId:req.user.uid });
  }
  const user=await userModel.findById(req.user.uid);
  user.totalUrls=user.totalUrls+1;
  if(!customAlias){
    customAlias = newUrl._id.toString();
  }
  newUrl.customAlias = customAlias;
  newUrl.shortCode = `${process.env.BASE_URL}/shorten/${newUrl.customAlias}`;
  await redisClient.set(customAlias, longUrl);
  await newUrl.save();
  await user.save();
  res.json({ shortUrl: newUrl.shortCode, createdAt: newUrl.createdAt });
}

export const getLongUrl = async (req, res) => {
  let url=await redisClient.get(req.params.alias);
  if (!url) {
    return res.status(404).json({ error: "URL not found" })
  }
  url=await urlModel.findOne({customAlias:req.params.alias});
  const user=await userModel.findById(url.userId);
  user.totalClicks=user.totalClicks+1;
  const todayDate=new Date(Date.now()).toISOString().split('T')[0];
  let flag=0;
  user.clicksByDate=user.clicksByDate.map(({date,noOfClicks})=>{
    if(date==todayDate){
      flag=1;
      return {date,noOfClicks:(noOfClicks+1)};
    }
    else{
      return {date,noOfClicks};
    }
  })
  if(!flag){
    user.clicksByDate.push({date:todayDate,noOfClicks:1});
  }
  const parser = new UAParser(req.headers["user-agent"]);
  const os = parser.getOS().name || "Unknown";
  const device = parser.getDevice().type || "desktop"; 
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  url.clicks.push({ ip, os, device, date: new Date() });
  flag=0;
  url.uniqueUsers.map((val)=>{
    if(val.toString()==user._id.toString()){
      flag=1;
    }
  })
  if(!flag){
    url.uniqueUsers.push(user._id);
  }
  await user.save();
  await url.save();
  return res.redirect(url.longUrl);
}