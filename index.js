import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import roleRoute from './routes/roles.js';
import authRoute from './routes/auth.js';
import regUserRoute from './routes/regUsers.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use('/api/roles', roleRoute);
app.use('/api/auth', authRoute);

app.use('/api/admin/users', regUserRoute);



//Response handler

app.use((obj, req, res, next)=>{
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong..";
    return res.status(statusCode).json({
       success : [200,201,204].some(a=> a === obj.status) ? true : false,
       status : statusCode,
       message : message,
       data: obj.data
    });
   })
// DB connection..
const connectMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connection success.')
    } catch(error) {
      throw error
    }
}

app.listen(8080, ()=>{
    connectMongoDB();
   console.log('App started listing..');
})