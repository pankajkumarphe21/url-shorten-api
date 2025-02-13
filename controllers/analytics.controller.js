import moment from 'moment';
import urlModel from '../models/user.model.js'

export const getSpecificAnalytics=async(req,res)=>{
    const { alias } = req.params;
    const url = await urlModel.findOne({ shortCode: alias });
    if (!url) return res.status(404).json({ error: "Short URL not found" });
    const totalClicks = url.clicks.length;
    
}