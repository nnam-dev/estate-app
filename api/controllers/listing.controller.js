import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createList = async (req, res, next) => {
  // if(req.user.id !== req.params.id) return next(errorHandler(401,'Forbidden'))
  if (!req.user.id) return next(errorHandler(401, "Forbidden"));

  try {
    const listing = await new Listing(req.body);
    listing.save();

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateList = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler("401", "Forbidden"));

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...others } = updateUser._doc;
    return res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  //if(req.user.id !== req.params.id) return next(errorHandler('401','Forbidden'))
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(404, "You can only delete your listing"));
  }

  try {
     await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listing deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
    //if(req.user.id !== req.params.id) return next(errorHandler('401','Forbidden'))
    const listing = await Listing.findById(req.params.id);
  
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
  
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(404, "You can only delete your listing"));
    }
   
    try {
      const updatedListing= await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
      return res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

  export const getListing=async (req,res,next)=>{
    //if(req.user.id !== req.params.id) return next(errorHandler('401','you can only view your listing'))

    try{
        
        const listings=await Listing.findById(req.params.id)

        if(!listings){
            return next(errorHandler(404,'Listing not found'))
        }
       
        return res.status(200).json(listings);

    }catch(error){
        next(error)
    }
}
