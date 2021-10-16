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
exports.synDataRouter = void 0;
const express_1 = __importDefault(require("express"));
const syndata_schema_1 = require("../schema/syndata.schema");
const mongoose_1 = require("mongoose");
exports.synDataRouter = express_1.default.Router();
exports.synDataRouter.get("/:projectid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SYNDATA = yield syndata_schema_1.SynDataColl.find({ project_id: new mongoose_1.Types.ObjectId(req.params.projectid) });
        res.status(200).json(SYNDATA);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error in fetching synthetic data");
    }
}));
