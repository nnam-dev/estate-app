import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken"


export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        return res.status(201).json("User created successfully");
    } catch (error) {
        return next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const validUser= await User.findOne({email});
      if (!validUser) return next(errorHandler(404,'User not found'))
      const validPassword=bcryptjs.compareSync(password,validUser.password)
      if(!validPassword) return next(errorHandler(401,'Wrong credentials'))

      const token =jwt.sign({id:validUser._id},process.env.JWT_SECRET)
      const {password:pass,...userInfo}=validUser._doc
      res.cookie('access_token',token,{httpOnly:true,expires:new Date(Date.now() + 24*60*60*1000)})
      .status(200)
      .json(userInfo)

    } catch (error) {
        return next(error);
    }
};

export const google = async (req, res, next) => {
    const { username,email,photo } = req.body;
  
    try {
      const user= await User.findOne({email});
      if (user) {
        const token =jwt.sign({id:user._id},process.env.JWT_SECRET)
        const {password:pass,...userInfo}=user._doc

        res.cookie('access_token',token,{httpOnly:true,expires:new Date(Date.now() + 24*60*60*1000)})
      .status(200)
      .json(userInfo)

      }else{
        const generatedPassword=Math.random().toString(36).slice(-8)
        const usernamed=username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
       
        const hashedPassword=bcryptjs.hashSync(generatedPassword,10)
        const newUser=new User({
            username:usernamed,
            email:email,
            password:hashedPassword,
            avatar:photo

        })
        await newUser.save();
        const token =jwt.sign({id:newUser._id},process.env.JWT_SECRET)
        const {password:pass,...userInfo}=newUser._doc

        res.cookie('access_token',token,{httpOnly:true,expires:new Date(Date.now() + 24*60*60*1000)})
      .status(200)
      .json(userInfo)
      }
      
    } catch (error) {
        return next(error);
    }
};
