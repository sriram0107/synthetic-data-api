import { model, Types, Schema } from "mongoose";

export const Model = new Schema({
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
    },
    parameters: {
            batchSize: {
                type: Number
            },
            trainingCycles: {
                type: Number
            }
        },
        syntheticData: [{
            name: {
                type: String,
            },
            data: [Object]
        }]
},
    {
        writeConcern: {
            w: "majority",
            j: true,
            wtimeout: 1000,
        }
    })

export const ModelColl = model("model",  Model);