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
exports.projectRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const project_schema_1 = require("../schema/project.schema");
const user_schema_1 = require("../schema/user.schema");
exports.projectRouter = express_1.default.Router();
exports.projectRouter.post("/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newID = new mongoose_1.Types.ObjectId();
        const newProject = new project_schema_1.ProjectColl({
            _id: newID,
            user_id: req.params.userid,
            name: req.body.name,
            realData: [],
            models: []
        });
        yield newProject.save();
        //update user coll
        yield user_schema_1.UserColl.updateOne({ _id: new mongoose_1.Types.ObjectId(req.params.userid) }, { $push: { projects: newID } });
        res.status(200).send("Project created");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error in creating project");
    }
}));
