"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectColl = exports.Project = void 0;
const mongoose_1 = require("mongoose");
exports.Project = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    user_id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    models: [{
            type: mongoose_1.Types.ObjectId,
        }]
}, {
    writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000,
    }
});
exports.ProjectColl = (0, mongoose_1.model)("project", exports.Project);
