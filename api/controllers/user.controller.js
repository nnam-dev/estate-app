import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';

export const test=(req,res)=>{
    res.json({
        message:"Api Route is working "
    })
}

export const updateUser=async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler('401','Forbidden'))

    try{
        if(req.body.password){
            const hashedPassword=bcryptjs.hashSync(req.body.password,10)
        }

        const updateUser=await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:hashedPassword,
                avatar:req.body.avatar
            }
        },{new:true})
        
        const {password,...others}=updateUser._doc
        return res.status(200).json(others)

    }catch(error){
        next(error)
    }
}

export const deleteUser=async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler('401','Forbidden'))

    try{
        
        const updateUser=await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token');
        return res.status(200).json('User deleted successfully');

    }catch(error){
        next(error)
    }
}


export const getUserListing=async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler('401','you can only view your listing'))

    try{
        
        const listings=await Listing.find({userRef:req.params.id})
       
        return res.status(200).json(listings);

    }catch(error){
        next(error)
    }
}

export const getUser=async (req,res,next)=>{
   
    try{
        
        const user=await User.findById(req.params.id)
        if(!user) return next(errorHandler(404,'User not found'))
       
        const {password:pass,...userinfo}=user._doc;
        return res.status(200).json(userinfo);

    }catch(error){
        next(error)
    }
}

