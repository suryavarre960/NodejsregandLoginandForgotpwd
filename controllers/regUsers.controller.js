import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js"
import User from "../models/User.js"

export const getAllUsers = async (req, res, next) =>{

    try{
      const users = await User.find();
      return next(CreateSuccess(200, "All Reg Users", users))
    } catch(error){
        return next(CreateError(500, "Something went wrong.."));
    }

}


export const getUserById = async (req, res, next) =>{
    try{
       const user = await User.findById(req.params.id);
       if(!user){
        return next(CreateError(404, "User not found.."));
       }
       return next(CreateSuccess(200, "user data", user));
    } catch(error){
        return next(CreateError(500, "Something went wrong.."));
    }
}