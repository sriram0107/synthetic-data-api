"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserColl = exports.User = void 0;
const mongoose_1 = require("mongoose");
exports.User = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    projects: [
        {
            type: mongoose_1.Types.ObjectId
        }
    ]
}, {
    writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000,
    }
});
exports.UserColl = (0, mongoose_1.model)("user", exports.User);
