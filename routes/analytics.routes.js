import express from "express";
import authUser from "../middleware/auth.middleware.js";
import { getSpecificAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get('/:alias',authUser,getSpecificAnalytics);

export default router;