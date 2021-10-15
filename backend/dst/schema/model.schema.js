"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelColl = exports.Model = void 0;
const mongoose_1 = require("mongoose");
exports.Model = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    project_id: {
        type: mongoose_1.Types.ObjectId,
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
}, {
    writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000,
    }
});
exports.ModelColl = (0, mongoose_1.model)("model", exports.Model);
