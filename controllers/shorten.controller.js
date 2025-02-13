import urlModel from "../models/url.model.js";
import redisClient from "../services/redis.service.js";
import {UAParser} from 'ua-parser-js';

export const getShortUrl = async (req, res) => {
  let { longUrl, customAlias, topic } = req.body;

  let newCode;
  if (customAlias) {
    const existingAlias = await redisClient.get(customAlias);
    if (existingAlias) return res.status(400).json({ error: "Alias already taken" });
  }
  else {
    newCode = await urlModel.create({ longUrl, topic });
  }
  customAlias = newCode._id.toString();
  newCode.shortCode = customAlias;
  newCode.customAlias = customAlias;
  await redisClient.set(customAlias, longUrl);
  await newCode.save();

  res.json({ shortUrl: `${process.env.BASE_URL}/shorten/${newCode.shortCode}`, createdAt: newCode.createdAt });
}

export const getLongUrl = async (req, res) => {
  const url = await urlModel.findOne({ customAlias: req.params.alias });
  // const url=await redisClient.get(req.params.alias);
  if (!url) {
    return res.status(404).json({ error: "URL not found" })
  }
  const parser = new UAParser(req.headers["user-agent"]);
  const os = parser.getOS().name || "Unknown";
  const device = parser.getDevice().type || "desktop"; 
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  url.clicks.push({ ip, os, device, date: new Date() });
  url.uniqueUsers = [...new Set([...url.uniqueUsers, req.user.email])];
  await url.save();
  return res.redirect(url.longUrl);
}