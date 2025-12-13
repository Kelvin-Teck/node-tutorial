"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.authenticate = authenticate;
const adminGuard = async (req, res, next) => {
    const user = await user_1.default.findByPk(req.user.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied" });
    }
    next();
};
exports.default = adminGuard;
