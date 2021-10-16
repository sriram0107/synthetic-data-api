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
exports.modelRouter = void 0;
const express_1 = __importDefault(require("express"));
const model_schema_1 = require("../schema/model.schema");
const project_schema_1 = require("../schema/project.schema");
const syndata_schema_1 = require("../schema/syndata.schema");
const mongoose_1 = require("mongoose");
const papaparse_1 = __importDefault(require("papaparse"));
exports.modelRouter = express_1.default.Router();
exports.modelRouter.get("/:projectid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modelData = yield model_schema_1.ModelColl.find({ project_id: new mongoose_1.Types.ObjectId(req.params.projectid) });
        res.status(200).json(modelData);
    }
    catch (err) {
        res.status(500).send("Could not fetch models");
    }
}));
exports.modelRouter.post("/custom/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectID = new mongoose_1.Types.ObjectId(req.params.id);
        const modelID = new mongoose_1.Types.ObjectId();
        console.log("req body -> ", req.body);
        const newModel = new model_schema_1.ModelColl({
            _id: modelID,
            project_id: projectID,
            name: req.body.name || "Sample Model",
            parameters: {
                batchSize: new Number(req.body.batchSize || "32"),
                trainingCycles: new Number(req.body.trainingCycles || "32")
            },
            syntheticData: []
        });
        yield newModel.save();
        yield project_schema_1.ProjectColl.updateOne({ project_id: projectID }, { $push: { models: modelID } });
        res.status(200).send("Model Created");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error in creating model");
    }
}));
exports.modelRouter.put("/changeName/:id/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_schema_1.ModelColl.updateOne({ _id: new mongoose_1.Types.ObjectId(req.params.id) }, { name: req.params.name });
        res.status(200).send("Model updated");
    }
    catch (err) {
        res.status(500).send("Could not delete model");
    }
}));
exports.modelRouter.delete("/:id/:projectid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modelID = new mongoose_1.Types.ObjectId(req.params.id);
        yield syndata_schema_1.SynDataColl.deleteMany({ model_id: modelID });
        yield model_schema_1.ModelColl.deleteOne({ _id: modelID });
        yield project_schema_1.ProjectColl.updateOne({ project_id: req.params.projectid }, { $pull: { models: req.params.id } });
        res.status(200).send("Model deleted");
    }
    catch (err) {
        res.status(500).send("Could not delete model");
    }
}));
exports.modelRouter.delete("/deleteData/:id/:dataid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataID = new mongoose_1.Types.ObjectId(req.params.dataid);
        yield syndata_schema_1.SynDataColl.deleteOne({ _id: dataID });
        yield model_schema_1.ModelColl.updateOne({ _id: new mongoose_1.Types.ObjectId(req.params.id) }, { $pull: { syntheticData: dataID } }, { multi: true });
        res.status(200).send("Model deleted");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Could not delete model");
    }
}));
exports.modelRouter.put("/createData/:name/:id/:projectid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = papaparse_1.default.parse(req.body["data_file"], { header: true });
        const rows = results.data;
        const newDataID = new mongoose_1.Types.ObjectId();
        const modelID = new mongoose_1.Types.ObjectId(req.params.id);
        const newData = new syndata_schema_1.SynDataColl({
            _id: newDataID,
            name: req.params.name,
            model_id: modelID,
            project_id: new mongoose_1.Types.ObjectId(req.params.projectid),
            data: rows
        });
        yield model_schema_1.ModelColl.updateOne({ _id: modelID }, { $push: { syntheticData: newDataID } });
        yield newData.save();
        res.status(200).send("Model updated");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Could not delete model");
    }
}));
