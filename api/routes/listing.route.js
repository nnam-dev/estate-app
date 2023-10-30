import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createList,deleteListing,updateListing,getListing } from "../controllers/listing.controller.js";

const router=express.Router();


router.post('/create',verifyToken,createList)
router.delete('/delete/:id',verifyToken,deleteListing)
router.post('/update/:id',verifyToken,updateListing)
router.get('/get/:id',getListing)



export default router