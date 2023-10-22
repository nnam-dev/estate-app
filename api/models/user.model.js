import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        required:true,
       
    },
},{timestamps:true});

const User=mongoose.Model('User',userSchema);

export default User;