import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js"


export const createList=async (req,res,next)=>{
   // if(req.user.id !== req.params.id) return next(errorHandler(401,'Forbidden'))
   if(!req.user.id) return next(errorHandler(401,'Forbidden'))

    try{
       
        const listing=await new Listing(req.body);
        listing.save();
        
        return res.status(201).json(listing)

    }catch(error){
        next(error)
    }
}


export const updateList=async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler('401','Forbidden'))

    try{
       
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
