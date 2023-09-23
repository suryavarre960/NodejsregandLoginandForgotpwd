import Roles from "../models/Roles.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import {CreateSuccess} from "../utils/success.js"
import {CreateError} from "../utils/error.js"
import jwt from "jsonwebtoken"
import UserToken from "../models/UserToken.js";
import nodemailer from "nodemailer";

export const rigistration = async (req, res, next)=>{
    const role = await Roles.find({role: 'User'});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        userName : req.body.userName,
        email : req.body.email,
        password : hashPassword,
        roles : role
    }) 
      await newUser.save();
      return next(CreateSuccess(200, "User Rigistration sucessful.."));
}

//Register as Admin
 
export const registerAdmin = async (req, res, next)=>{
    const role = await Roles.find({});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        userName : req.body.userName,
        email : req.body.email,
        password : hashPassword,
        isAdmin : true,
        roles : role
    }) 
      await newUser.save();
      return next(CreateSuccess(200, "Admin Rigistration is sucessful.."));
}


//Login 
export const login = async (req, res, next)=>{
   try{
    const user = await User.findOne({email: req.body.email})
    .populate("roles", "role");
    
    if(!user){
    return next(CreateError(404, "User Not found.."));    
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if(!isPasswordCorrect){
        return next(CreateError(400, "Password incorrect.."));
    }
    const { roles} = user;
    const expiryTime = 3000;
    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin, roles: roles,}, 
        process.env.JWT_SECRET, {expiresIn: expiryTime}
        )

        res.cookie("access_token", token, {httpOnly: true})
        .status(200)
        .json({
            status: 200,
            message: "Login Sucessful..",
            data: user,
            token:token,
            expiresIn: expiryTime
        })
    //return next(CreateSuccess(200, "Login successful..."))

   } catch(error){
    return next(CreateError(500, "Something went wrong.."));

   }
}

//Forgot password

export const forgotPassword = async (req, res, next)=>{
 const email = req.body.email;
 const user = await User.findOne({email: {$regex: '^'+email+'$', $options: 'i'}});
 if(!user){
    return next(CreateError(404, "User Email Not found.."));
 }
 const payload = {
    email: user.email
 }
 const expiryTime = 300;
 const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: expiryTime});
 const newToken = new UserToken({
    userId: user._id,
    token: token
 });

 const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "surya.varre@gmail.com",
        pass: "gwvhajjtubicehun"
        // pass: "gwvh ajjt ubic ehun"
    }
 });
 let mailDetails =  {
    from: "surya.varre@gmail.com",
    to: email,
    subject: "Reset Your Password..",
    html: `
     <html>
     <head>
     <title>Reset Password Request</title>
     </head>
     <body>
     </body>
     <p>Dear ${user.userName}</p>
     <a href=${process.env.LIVE_URL}/reset/${token}><button>Reset</button></a>
     </html>
    `,
 };
 mailTransporter.sendMail(mailDetails, async(err, data)=>{
    if(err){
        console.log(err);
        return next(CreateError(500, "Something Went Wrong"));
    } else{
        await newToken.save();
        return next(CreateSuccess(200, "Email Send Succesfully.."));
    }
 })

}

//Reset Password 

export const resetPassword = (req, res, next)=>{
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, async(err, data)=>{
    if(err){
        return res.next(CreateError(500, "Reset Link is Expired.."));
    }else{
        const response = data;
        const user = await User.findOne({email: {$regex: '^'+response.email+'$', $options: 'i'}});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashPassword;

        try{
            const newUser = await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user},
                {new: true}
            )
               return next(CreateSuccess(200, "Password Reset Success!."));
        } catch(error){
            return next(CreateError(500, "Something went Wrong while reset password."));
        }
    }
  })
}