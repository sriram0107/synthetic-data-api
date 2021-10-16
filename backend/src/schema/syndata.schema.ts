import { model, Types, Schema } from "mongoose";

export const SynData = new Schema({
    _id: {
        type: Types.ObjectId,
        required: true,
    },
    model_id: {
        type: Types.ObjectId,
        required: true,
    },
    project_id: {
        type: Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        unique: true,
    },
    data: [Object],
},
    {
        writeConcern: {
            w: "majority",
            j: true,
            wtimeout: 1000,
        }
    })

export const SynDataColl = model("syntheticdata",  SynData);