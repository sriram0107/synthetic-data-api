import { model, Types, Schema } from "mongoose";
import { Model } from "./model.schema";

export const Project = new Schema({
    _id: {
        type: Types.ObjectId,
        required: true,
    },
    user_id: {
        type: Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    models: [{
        type: Types.ObjectId,
    }]
},
{
        writeConcern: {
            w: "majority",
            j: true,
            wtimeout: 1000,
        }
    })

export const ProjectColl = model("project",  Project);