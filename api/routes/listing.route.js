import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createList,deleteListing,updateListing } from "../controllers/listing.controller.js";

const router=express.Router();


router.post('/create',verifyToken,createList)
router.delete('/delete/:id',verifyToken,deleteListing)
router.post('/update/:id',verifyToken,updateListing)
//router.delete('/delete/:id',verifyToken,deleteList)



export default router