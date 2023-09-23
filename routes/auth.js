import express from "express";
import {rigistration, login, registerAdmin, forgotPassword, resetPassword} from "../controllers/auth.controller.js"

const router = express.Router();

//Registration

router.post('/register', rigistration);

router.post('/login', login);

//Register as admin

router.post('/register-admin', registerAdmin);

//forgot-password send email
router.post('/send-email', forgotPassword);

//reset-password 
router.post('/reset', resetPassword);


export default router;