import mongoose, { Schema } from "mongoose";
import Roles from "../models/Roles.js";

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    userName: {
        type: String,
        require: true,
        uinque: true
    },
    email: {
        type: String,
        require: true,
        uinque: true
    },
    password: {
        type: String,
        require: true
    },
    profileImage: {
        type: String,
        require: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    roles : {
        type : [Schema.Types.ObjectId],
        require : true,
        ref : "Role"
    }
},
    {
        timestamps: true
    });

export default mongoose.model("User", UserSchema);