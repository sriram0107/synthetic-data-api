import { Types } from "mongoose";

export type Dataset = {
    _id: String;
    user_id: String;
    name: String;
    data: [Object];
}

export type Model = {
    _id: String,
    project_id: String,
    name: String,
    parameters: {
            batchSize: Number,
            trainingCycles: Number
        },
        syntheticData: [{
            name: String,
            data: [Object]
        }]
}
