import jwt from "jsonwebtoken"
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js"

export const verifyToken = async (req, res, next) =>{
    const token = req.cookies.access_token;
    if(!token){
     return next(CreateError(401, "You are not Authenticated.."));
    } else{
    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
        if(err){
            return next(CreateError(403, "Token is not valid.."));
        } else{
            req.user = user
        }
        next();
    })
    }
}


export const verifyUser = async (req, res, next) =>{
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else{
            return next(CreateError(403, "You are not Authraised.."));
        }
    })
}


export const verifyAdmin = async (req, res, next) =>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next();
        } else{
            return next(CreateError(403, "You are not Authraised.."));
        }
    })
}
