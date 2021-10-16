import express from 'express';
import { Request, Response, NextFunction } from "express";
import { SynDataColl } from "../schema/syndata.schema";
import { Types } from "mongoose";

export const synDataRouter = express.Router();

synDataRouter.get("/:projectid", async (req: Request, res: Response) => {
    try {
        const SYNDATA = await SynDataColl.find({project_id: new Types.ObjectId(req.params.projectid)});
        res.status(200).json(SYNDATA);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in fetching synthetic data");
    }
})