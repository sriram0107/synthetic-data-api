import express from 'express';
import { Request, Response, NextFunction } from "express";
import { UserColl as User } from "../schema/user.schema";
import { Types } from "mongoose";

export const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
    try {
        const USER = await User.findOne();
        res.status(200).json(USER);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in finding user");
    }
})

userRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const USER = await User.findOne({_id: new Types.ObjectId(req.params.id)});
        res.status(200).json(USER);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in finding user");
    }
})

userRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newUser = new User({
        _id: new Types.ObjectId(),
        name: req.body.name || "Sample User",
        projects: []
        })
        await newUser.save();
        res.status(200).send("User created");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in creating user");
    }
})


userRouter.delete("/", async (req: Request, res: Response) => {
    try {
        const USER = await User.deleteOne();
        res.status(200).send("Deleted user");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in deleting user");
    }
})