import { model, Types, Schema } from "mongoose";
import { Project } from "./project.schema";

export const User = new Schema({
    _id: {
        type: Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    projects: [
        {
            type: Types.ObjectId
        }
    ]
},
    {
        writeConcern: {
            w: "majority",
            j: true,
            wtimeout: 1000,
        }
    })
export const UserColl = model("user",  User);