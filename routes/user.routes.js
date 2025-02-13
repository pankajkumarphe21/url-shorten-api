import express from "express";
import { loginUser } from "../controllers/user.controller.js";

const router=express.Router();

router.post("/google-signin",loginUser);

export default router;