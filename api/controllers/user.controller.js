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
                password:req.body.password,
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
