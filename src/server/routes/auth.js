import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup",async(req,res)=>{

    try{
        const {username,email,password} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User Already Exists"});
        }
        //hashed password
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
          await user.save();
          res.json({ message: "User created successfully" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }

});

router.post("/login",async(req,res)=>{

    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Email Not Found"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid Password"});
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.json({token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
});
export default router;