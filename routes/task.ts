import express, { Request, Response } from "express";
import Task from "../models/task";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/create", authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
        received: { title: !!title, description: !!description },
      });
    }

    // Ensure userId exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const task = await Task.create({
      title,
      description,
        userId: req.user.id,
      

    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error: any) {
  
    return res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});



export default router;
