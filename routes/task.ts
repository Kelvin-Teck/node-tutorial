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



router.patch('/assign-task/:taskId', authenticate, async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { assigneeId } = req.body

  if (!taskId) {
  
}

  if (!assigneeId) {
    return res.status(400).json({ message: 'Assignee ID is required' });
  }

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.assigneeId = assigneeId;
    await task.save();

    return res.status(200).json({ message: 'Task assigned successfully', task });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to assign task', error: error.message });
  }
  
})
 

router.patch('/update-status/:taskId', authenticate, async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { status } = req.body

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required' });
  }

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const task = await Task.findByPk(taskId);


    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assigneeId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this task' });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update task status', error: error.message });
  }
}
  )






export default router;
