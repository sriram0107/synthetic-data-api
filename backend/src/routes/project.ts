import express from 'express';
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ProjectColl } from "../schema/project.schema";
import { UserColl } from '../schema/user.schema';
export const projectRouter = express.Router();

projectRouter.post("/:userid", async (req: Request, res: Response) => {
    try {
        const newID = new Types.ObjectId();
        const newProject = new ProjectColl({
            _id: newID,
            user_id: req.params.userid,
            name: req.body.name,
            realData: [],
            models: []
        })
        await newProject.save();

        //update user coll
        await UserColl.updateOne({_id: new Types.ObjectId(req.params.userid)}, {$push: {projects: newID}})

        res.status(200).send("Project created");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in creating project");
    }
})
