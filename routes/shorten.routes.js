import express from "express";
import { getLongUrl, getShortUrl } from "../controllers/shorten.controller.js";
import authUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/', authUser,getShortUrl);
router.get('/:alias',authUser,getLongUrl);

export default router;