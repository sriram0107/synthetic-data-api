import express from 'express';
import { datasetRouter } from "./routes/dataset";
import { modelRouter } from "./routes/model";
import { userRouter } from './routes/user';
import { projectRouter } from './routes/project';
import mongoose from "mongoose";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
require("dotenv").config();

// Set rate limit properties
const MINUTES = 15;
const limiter = rateLimit({
  windowMs: MINUTES * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});

// Connect to database
mongoose.connect(
    process.env.DB as string || "mongodb+srv://usr:usr100@cluster0.fajaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    //{ useNewUrlParser: true, useUnifiedTopology: true }
);
const database = mongoose.connection;
database.on("error", () => console.log("Unable to connect to the database"));
database.once("open", () => console.log("Connected to database"));

// Express config
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({limit: '50mb'}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// Rate limiting is disabled for testing
app.use(limiter);

// For sending view 
app.use(express.static(path.join(__dirname, "./frontend")));

app.get("/", (req, res) => {
  res.send("Welcome to the Synthetic Data API");
})

// Config API Routes
app.use("/dataset",  datasetRouter);
app.use("/model", modelRouter);
app.use("/user", userRouter);
app.use("/project",  projectRouter);

// Start Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));