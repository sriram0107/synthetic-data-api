import { model, Types, Schema } from "mongoose";


export const realDataColl = new Schema({
    _id: {
        type: Types.ObjectId,
        required: true,
    },
    user_id: {
        type: Types.ObjectId,
        required: true,
    },
    name: String,
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