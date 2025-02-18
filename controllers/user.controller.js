import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import admin from "../config/firebase.js";

export const loginUser = async (req, res) => {
    try {
        // idToken needs to be taken from firebase
        const { idToken } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const {email, name } = decodedToken;
        let user=await userModel.findOne({email});
        if(!user){
            user=await userModel.create({email,name});
        }
        const token = jwt.sign({ uid:user._id, email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token",token);
        res.json({
            message: "User authenticated successfully",
            token,
            user: { uid:user._id, email, name }
        });
    } catch (error) {
        // console.error(error);
        res.status(401).json({ error: "Invalid ID token" });
    }
}