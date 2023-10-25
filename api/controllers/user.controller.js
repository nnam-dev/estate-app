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

        const updateUser=await User.findByIdAndUpdate(req.user.id,{
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
