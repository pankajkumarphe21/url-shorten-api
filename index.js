import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";
import connect from "./db/db.js";
import userRoutes from './routes/user.routes.js'
import shortenRoutes from './routes/shorten.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'

dotenv.config();

connect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());
// app.use(rateLimit({ windowMs: 60 * 1000, max: 5 })); 

app.use('/api/user',userRoutes);
app.use('/api/shorten',shortenRoutes);
app.use('/api/analytics',analyticsRoutes);

app.listen(8800);