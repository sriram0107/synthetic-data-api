"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.realData = exports.realDataColl = void 0;
const mongoose_1 = require("mongoose");
exports.realDataColl = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    user_id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    name: String,
    data: [Object]
}, {
    writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000,
    }
});
exports.realData = (0, mongoose_1.model)("realdata", exports.realDataColl);
