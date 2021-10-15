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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_schema_1 = require("../schema/user.schema");
const mongoose_1 = require("mongoose");
exports.userRouter = express_1.default.Router();
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const USER = yield user_schema_1.UserColl.findOne();
        res.status(200).json(USER);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error in finding user");
    }
}));
exports.userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const USER = yield user_schema_1.UserColl.findOne({ _id: new mongoose_1.Types.ObjectId(req.params.id) });
        res.status(200).json(USER);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error in finding user");
    }
}));
exports.userRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new user_schema_1.UserColl({
            _id: new mongoose_1.Types.ObjectId(),
            name: req.body.name || "Sample User",
            projects: []
        });
        yield newUser.save();
        res.status(200).send("User created");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error in creating user");
    }
}));
exports.userRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const USER = yield user_schema_1.UserColl.deleteOne();
        res.status(200).send("Deleted user");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error in deleting user");
    }
}));
