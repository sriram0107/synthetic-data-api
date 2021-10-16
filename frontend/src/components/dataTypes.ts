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
        syntheticData: [String]
}

export type SynData = {
    _id: String,
    model_id: String,
    project_id:  String,
    name: String,
    data: [Object],
}
