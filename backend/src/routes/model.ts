import express from 'express';
import { Request, Response, NextFunction } from "express";
import { ModelColl } from "../schema/model.schema";
import { ProjectColl } from "../schema/project.schema";
import { Types } from "mongoose";
import Papa from "papaparse";

export const modelRouter = express.Router();

modelRouter.get("/:projectid", async (req: Request, res: Response) => {
    try {
        const modelData = await ModelColl.find({ project_id: new Types.ObjectId(req.params.projectid) });
        res.status(200).json(modelData);
    } catch (err) {
        res.status(500).send("Could not fetch models")
    }
})

modelRouter.post("/custom/:id", async (req: Request, res: Response) => {
    try {
        const projectID = new Types.ObjectId(req.params.id);
        const modelID = new Types.ObjectId();
        console.log("req body -> ", req.body);
        const newModel = new ModelColl({
            _id: modelID,
            project_id: projectID,
            name: req.body.name || "Sample Model",
            parameters: {
                batchSize: new Number(req.body.batchSize || "32"),
                trainingCycles: new Number(req.body.trainingCycles || "32")
            },
            syntheticData: []
        })

        await newModel.save();
        // have to update project coll here ------------------------------------------>
        await ProjectColl.updateOne({project_id: projectID}, {$push: {models: modelID}});
        res.status(200).send("Model Created");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in creating model");
    }
})

modelRouter.put("/changeName/:id/:name", async (req: Request, res: Response) => {
    try {
        await ModelColl.updateOne({ _id: new Types.ObjectId(req.params.id) }, {name: req.params.name});
        res.status(200).send("Model updated");
    } catch (err) {
        res.status(500).send("Could not delete model");
    }
})

modelRouter.delete("/:id/:projectid", async (req: Request, res: Response) => {
    try {
        await ModelColl.deleteOne({ _id: new Types.ObjectId(req.params.id) });
        await ProjectColl.updateOne({project_id: req.params.projectid}, {$pull: {models: req.params.id}});
        res.status(200).send("Model deleted");
    } catch (err) {
        res.status(500).send("Could not delete model");
    }
})

modelRouter.delete("/deleteData/:id/:name", async (req: Request, res: Response) => {
    console.log("deletedata route")
    try {
        await ModelColl.updateMany({ _id: new Types.ObjectId(req.params.id) }, { $pull: { syntheticData: { name: req.params.name }}}, {multi: true});
        res.status(200).send("Model deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not delete model");
    }
})

modelRouter.put("/createData/:name/:id", async (req: Request, res: Response) => {
    try {
        const results = Papa.parse(req.body["data_file"], { header: true });
        const rows = results.data;
        const newData = {
            name: req.params.name,
            data: rows
        }
        await ModelColl.updateOne({ _id: new Types.ObjectId(req.params.id) }, { $push: { syntheticData: newData }});
        res.status(200).send("Model updated");
    } catch (err) {
        console.log(err)
        res.status(500).send("Could not delete model");
    }
})

