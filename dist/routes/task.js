"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = __importDefault(require("../models/task"));
const auth_1 = __importStar(require("../middlewares/auth"));
const router = express_1.default.Router();
router.post("/create", auth_1.authenticate, async (req, res) => {
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
        const task = await task_1.default.create({
            title,
            description,
            userId: req.user.id,
        });
        return res.status(201).json({
            message: "Task created successfully",
            task,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to create task",
            error: error.message,
        });
    }
});
router.patch("/assign-task/:taskId", [auth_1.authenticate,
    auth_1.default], async (req, res) => {
    const { taskId } = req.params;
    const { assigneeId } = req.body;
    if (!taskId) {
    }
    if (!assigneeId) {
        return res.status(400).json({ message: "Assignee ID is required" });
    }
    try {
        const task = await task_1.default.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.assigneeId = assigneeId;
        await task.save();
        return res
            .status(200)
            .json({ message: "Task assigned successfully", task });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to assign task", error: error.message });
    }
});
router.patch("/update-status/:taskId", auth_1.authenticate, async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    if (!taskId) {
        return res.status(400).json({ message: "Task ID is required" });
    }
    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }
    try {
        const task = await task_1.default.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (task.assigneeId !== req.user.id) {
            return res
                .status(403)
                .json({ message: "You are not authorized to update this task" });
        }
        task.status = status;
        await task.save();
        return res
            .status(200)
            .json({ message: "Task status updated successfully", task });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to update task status",
            error: error.message,
        });
    }
});
router.get("/tasks", auth_1.authenticate, async (req, res) => {
    try {
        const { status, page, limit } = req.query;
        const pageNumber = Number(page) || 1;
        const pageLimit = Number(limit) || 10;
        console.log(pageNumber, pageLimit);
        const offset = (pageNumber - 1) * pageLimit;
        if (status == "pending") {
            const { rows, count } = await task_1.default.findAndCountAll({
                where: {
                    userId: req.user.id,
                    status: "pending",
                    isDeleted: false,
                },
                limit: pageLimit,
                offset: offset
            });
            return res.status(200).json({ tasks: rows, totalRecords: count });
        }
        if (status == "in-progress") {
            const { rows, count } = await task_1.default.findAndCountAll({
                where: {
                    userId: req.user.id,
                    status: "in-progress",
                    isDeleted: false,
                },
                offset: offset,
                limit: pageLimit
            });
            return res.status(200).json({ tasks: rows, totalRecords: count });
        }
        if (status == "completed") {
            const { rows, count } = await task_1.default.findAndCountAll({
                where: {
                    userId: req.user.id,
                    status: "completed",
                    isDeleted: false,
                },
                offset: offset,
                limit: pageLimit
            });
            return res.status(200).json({ tasks: rows, totalRecords: count });
        }
        const { rows, count } = await task_1.default.findAndCountAll({
            where: {
                userId: req.user.id,
                isDeleted: false,
            },
            offset: offset,
            limit: pageLimit
        });
        return res.status(200).json({ tasks: rows, totalRecords: count });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to fetch tasks", error: error.message });
    }
});
router.patch("/delete-task/:taskId", auth_1.authenticate, async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await task_1.default.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.isDeleted = true;
        await task.save();
        return res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
    }
});
exports.default = router;
