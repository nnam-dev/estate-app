import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createList } from "../controllers/listing.controller.js";

const router=express.Router();


router.post('/create',verifyToken,createList)
//router.post('/update/:id',verifyToken,updateList)
//router.delete('/delete/:id',verifyToken,deleteList)



export default router