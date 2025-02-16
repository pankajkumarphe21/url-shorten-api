import express from "express";
import authUser from "../middleware/auth.middleware.js";
import { getOverallAnalytics, getSpecificAnalytics, getTopicAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get('/overall',authUser,getOverallAnalytics);
router.get('/:alias',authUser,getSpecificAnalytics);
router.get('/topic/:topic',authUser,getTopicAnalytics);

export default router;