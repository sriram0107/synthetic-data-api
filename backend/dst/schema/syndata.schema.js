"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynDataColl = exports.SynData = void 0;
const mongoose_1 = require("mongoose");
exports.SynData = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    model_id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    project_id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        unique: true,
    },
    data: [Object],
}, {
    writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000,
    }
});
exports.SynDataColl = (0, mongoose_1.model)("syntheticdata", exports.SynData);
