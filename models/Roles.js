import mongoose from "mongoose";

const RolesSchema = mongoose.Schema(
    {
        role : {
            type : String,
            require : true
        }
    },
    {
        timestamps : true
    }
);

export default mongoose.model("Role", RolesSchema)