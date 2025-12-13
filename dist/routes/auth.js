"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await user_1.default.findOne({ where: { email } });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = await user_1.default.create({
        firstName,
        lastName,
        email,
        role,
        password: hashedPassword,
    });
    res.status(201).json({
        user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role
        },
    });
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await user_1.default.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.status(200).json({
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        token,
    });
});
router.get("/users", async (req, res) => {
    try {
        const users = await user_1.default.findAll({
            attributes: ["id", "firstName", "lastName", "email"],
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});
exports.default = router;
