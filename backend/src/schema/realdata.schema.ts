import { model, Types, Schema } from "mongoose";


export const realDataColl = new Schema({
    _id: {
        type: Types.ObjectId,
        required: true,
    },
    project_id: {
        type: Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    data: [Object]
},
    {
        writeConcern: {
            w: "majority",
            j: true,
            wtimeout: 1000,
        }
    })

export const realData = model("realdata",  realDataColl);