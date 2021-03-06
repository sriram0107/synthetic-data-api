import express from 'express';
import { Request, Response, NextFunction } from "express";
import { ModelColl } from "../schema/model.schema";
import { ProjectColl } from "../schema/project.schema";
import { SynDataColl } from "../schema/syndata.schema";
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
        const modelID = new Types.ObjectId(req.params.id);
        await SynDataColl.deleteMany({ model_id: modelID });
        await ModelColl.deleteOne({ _id: modelID });
        await ProjectColl.updateOne({project_id: req.params.projectid}, {$pull: {models: req.params.id}});
        res.status(200).send("Model deleted");
    } catch (err) {
        res.status(500).send("Could not delete model");
    }
})

modelRouter.delete("/deleteData/:id/:dataid", async (req: Request, res: Response) => {
    try {
        const dataID = new Types.ObjectId(req.params.dataid);
        await SynDataColl.deleteOne({ _id: dataID });
        await ModelColl.updateOne({ _id: new Types.ObjectId(req.params.id) }, { $pull: { syntheticData: dataID}}, {multi: true});
        res.status(200).send("Model deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not delete model");
    }
})

modelRouter.put("/createData/:name/:id/:projectid", async (req: Request, res: Response) => {
    try {
        const results = Papa.parse(req.body["data_file"], { header: true });
        const rows = results.data;
        const newDataID = new Types.ObjectId();
        const modelID = new Types.ObjectId(req.params.id);
        const newData = new SynDataColl({
            _id: newDataID,
            name: req.params.name,
            model_id: modelID,
            project_id: new Types.ObjectId(req.params.projectid),
            data: rows
        })
        await ModelColl.updateOne({ _id: modelID }, { $push: { syntheticData: newDataID } });
        await newData.save();
        res.status(200).send("Model updated");
    } catch (err) {
        console.log(err)
        res.status(500).send("Could not delete model");
    }
})

