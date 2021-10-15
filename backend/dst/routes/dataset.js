"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.datasetRouter = void 0;
const express_1 = __importDefault(require("express"));
const realdata_schema_1 = require("../schema/realdata.schema");
const user_schema_1 = require("../schema/user.schema");
const mongoose_1 = require("mongoose");
exports.datasetRouter = express_1.default.Router();
exports.datasetRouter.get("/:projectid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield realdata_schema_1.realData.find({ project_id: new mongoose_1.Types.ObjectId(req.params.projectid) });
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).send("Could not get data");
    }
}));
exports.datasetRouter.delete("/deleteData/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id, typeof (req.params.id));
        yield realdata_schema_1.realData.deleteOne({ _id: new mongoose_1.Types.ObjectId(req.params.id) });
        res.status(200).send("Model deleted");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Could not delete model");
    }
}));
exports.datasetRouter.put("/updateName/:name/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield realdata_schema_1.realData.updateOne({ _id: new mongoose_1.Types.ObjectId(req.params.id) }, { name: req.params.name });
        res.status(200).send("Model updated");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Could not update model");
    }
}));
exports.datasetRouter.post("/createData/:name/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newID = new mongoose_1.Types.ObjectId();
        const newData = new realdata_schema_1.realData({
            _id: newID,
            user_id: req.params.userid,
            name: req.params.name,
            data: req.body.data,
        });
        yield newData.save();
        // have to update user's coll here 
        yield user_schema_1.UserColl.updateOne({ _id: new mongoose_1.Types.ObjectId(req.params.userid) }, { $push: { projects: newID } });
        res.status(200).send("Model updated");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Could not create model");
    }
}));
