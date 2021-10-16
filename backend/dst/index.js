"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataset_1 = require("./routes/dataset");
const model_1 = require("./routes/model");
const user_1 = require("./routes/user");
const project_1 = require("./routes/project");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
require("dotenv").config();
const upload = (0, multer_1.default)();
// Set rate limit properties
const MINUTES = 15;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: MINUTES * 60 * 1000,
    max: 1000 // limit each IP to 100 requests per windowMs
});
// Connect to database
mongoose_1.default.connect(process.env.DB);
const database = mongoose_1.default.connection;
database.on("error", () => console.log("Unable to connect to the database"));
database.once("open", () => console.log("Connected to database"));
// Express config
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(upload.array("avatar"));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false, limit: '50mb' }));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(limiter);
// For sending view 
app.use(express_1.default.static(path_1.default.join(__dirname, "./frontend")));
app.get("/", (req, res) => {
    res.send("Welcome to the Synthetic Data API");
});
// Config API Routes
app.use("/dataset", dataset_1.datasetRouter);
app.use("/model", model_1.modelRouter);
app.use("/user", user_1.userRouter);
app.use("/project", project_1.projectRouter);
// Start Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
