import moment from 'moment';
import urlModel from '../models/url.model.js'
import redisClient from '../services/redis.service.js';

export const getSpecificAnalytics=async(req,res)=>{
    try {
        const { alias } = req.params;
        let url=await redisClient.get(alias);
        if (!url) return res.status(404).json({ error: "Short URL not found" });
        url = await urlModel.findOne({ customAlias:alias }).populate("uniqueUsers", "_id");
        const totalClicks = url.clicks.length;
    
        // Unique users count
        const uniqueUsers = url.uniqueUsers.length;
    
        // Get clicks in the last 7 days
        const sevenDaysAgo = moment().subtract(7, "days").startOf("day");
        const recentClicks = url.clicks.filter((click) =>
          moment(click.date).isAfter(sevenDaysAgo)
        );
    
        // Clicks grouped by date (last 7 days)
        const clicksByDate = {};
        recentClicks.forEach((click) => {
          const date = moment(click.date).format("YYYY-MM-DD");
          clicksByDate[date] = (clicksByDate[date] || 0) + 1;
        });
    
        // Convert to array format
        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
          date,
          noOfClicks: count,
        }));
    
        // Group by OS Type
        const osType = {};
        recentClicks.forEach((click) => {
          if (click.os) {
            osType[click.os] = osType[click.os] || { uniqueClicks: 0, uniqueUsers: new Set() };
            osType[click.os].uniqueClicks++;
            osType[click.os].uniqueUsers.add(click.ip); // Unique users by IP
          }
        });
    
        // Format OS analytics
        const osTypeArray = Object.entries(osType).map(([osName, data]) => ({
          osName,
          uniqueClicks: data.uniqueClicks,
          uniqueUsers: data.uniqueUsers.size,
        }));
    
        // Group by Device Type
        const deviceType = {};
        recentClicks.forEach((click) => {
          if (click.device) {
            deviceType[click.device] = deviceType[click.device] || {
              uniqueClicks: 0,
              uniqueUsers: new Set(),
            };
            deviceType[click.device].uniqueClicks++;
            deviceType[click.device].uniqueUsers.add(click.ip);
          }
        });
    
        // Format Device analytics
        const deviceTypeArray = Object.entries(deviceType).map(([deviceName, data]) => ({
          deviceName,
          uniqueClicks: data.uniqueClicks,
          uniqueUsers: data.uniqueUsers.size,
        }));
    
        // Response
        return res.json({
          totalClicks,
          uniqueUsers,
          clicksByDate: clicksByDateArray,
          osType: osTypeArray,
          deviceType: deviceTypeArray,
        });
        
    } catch (error) {
      console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getTopicAnalytics=async(req,res)=>{
    try {
        const { topic } = req.params;
    
        const urls = await urlModel.find({ topic }).populate("uniqueUsers", "_id");
    
        if (!urls.length) {
          return res.status(404).json({ message: "No URLs found for this topic" });
        }
    
        let totalClicks = 0;
        let uniqueUsersSet = new Set();
        let clicksByDate = {};
    
        const urlsAnalytics = urls.map((url) => {
          totalClicks += url.clicks.length;
          url.uniqueUsers.forEach((user) => uniqueUsersSet.add(user._id.toString()));
    
          url.clicks.forEach((click) => {
            const date = moment(click.date).format("YYYY-MM-DD");
            clicksByDate[date] = (clicksByDate[date] || 0) + 1;
          });
    
          return {
            shortUrl: url.shortCode, 
            totalClicks: url.clicks.length,
            uniqueUsers: new Set(url.uniqueUsers.map((user) => user._id.toString())).size,
          };
        });
    
        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
          date,
          noOfClicks: count,
        }));
    
        res.json({
          totalClicks,
          uniqueUsers: uniqueUsersSet.size,
          clicksByDate: clicksByDateArray,
          urls: urlsAnalytics,
        });
      } catch (error) {
        console.error("Error fetching topic analytics:", error);
        res.status(500).json({ message: "Internal server error" });
      }
}

export const getOverallAnalytics=async(req,res)=>{
    try {
        const userId = req.user.uid; 
    
        const urls = await urlModel.find({ userId }).populate("uniqueUsers", "_id");
    
        if (!urls.length) {
          return res.status(404).json({ message: "No URLs found for this user" });
        }
    
        let totalUrls = urls.length;
        let totalClicks = 0;
        let uniqueUsersSet = new Set();
        let clicksByDate = {};
        let osType = {};
        let deviceType = {};
    
        urls.forEach((url) => {
          totalClicks += url.clicks.length;
          url.uniqueUsers.forEach((user) => uniqueUsersSet.add(user._id.toString()));
          url.clicks.forEach((click) => {
            const date = moment(click.date).format("YYYY-MM-DD");
            clicksByDate[date] = (clicksByDate[date] || 0) + 1;
            if (click.os) {
              osType[click.os] = osType[click.os] || { uniqueClicks: 0, uniqueUsers: new Set() };
              osType[click.os].uniqueClicks++;
              osType[click.os].uniqueUsers.add(click.ip);
            }
            if (click.device) {
              deviceType[click.device] = deviceType[click.device] || {
                uniqueClicks: 0,
                uniqueUsers: new Set(),
              };
              deviceType[click.device].uniqueClicks++;
              deviceType[click.device].uniqueUsers.add(click.ip);
            }
          });
        });
        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
          date,
          noOfClicks: count,
        }));
        const osTypeArray = Object.entries(osType).map(([osName, data]) => ({
          osName,
          uniqueClicks: data.uniqueClicks,
          uniqueUsers: data.uniqueUsers.size,
        }));
        const deviceTypeArray = Object.entries(deviceType).map(([deviceName, data]) => ({
          deviceName,
          uniqueClicks: data.uniqueClicks,
          uniqueUsers: data.uniqueUsers.size,
        }));
    
        res.json({
          totalUrls,
          totalClicks,
          uniqueUsers: uniqueUsersSet.size,
          clicksByDate: clicksByDateArray,
          osType: osTypeArray,
          deviceType: deviceTypeArray,
        });
      } catch (error) {
        console.error("Error fetching overall analytics:", error);
        res.status(500).json({ message: "Internal server error" });
      }
}