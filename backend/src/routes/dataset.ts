import express from 'express';
import { Request, Response, NextFunction } from "express";
import { realData } from "../schema/realdata.schema";
import { UserColl as User } from "../schema/user.schema";
import { Types } from "mongoose";
import csvtojson from "csvtojson";

export const datasetRouter = express.Router();

datasetRouter.get("/:projectid", async (req: Request, res: Response) => {
    try {
        const data = await realData.find({ project_id: new Types.ObjectId(req.params.projectid) });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).send("Could not get data");
    }
})

datasetRouter.delete("/deleteData/:id", async (req: Request, res: Response) => {
    try {
        console.log(req.params.id, typeof(req.params.id))
        await realData.deleteOne({ _id: new Types.ObjectId(req.params.id) });
        res.status(200).send("Model deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send("Could not delete model");
    }
})

datasetRouter.put("/updateName/:name/:id", async (req: Request, res: Response) => {
    try {
        await realData.updateOne({ _id: new Types.ObjectId(req.params.id) }, { name: req.params.name });
        res.status(200).send("Model updated");
    } catch (err) {
        console.log(err)
        res.status(500).send("Could not update model");
    }
})

datasetRouter.post("/createData/:name/:userid", async (req: Request, res: Response) => {
    try {
        const newID = new Types.ObjectId();
        const newData = new realData({
            _id: newID,
            user_id: req.params.userid,
            name: req.params.name,
            data: req.body.data,
        })
        await newData.save();
        // have to update user's coll here 
        await User.updateOne({ _id: new Types.ObjectId(req.params.userid) }, { $push: { projects: newID } });
        res.status(200).send("Model updated");
    } catch (err) {
        console.log(err)
        res.status(500).send("Could not create model");
    }
})

