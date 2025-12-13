"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = __importDefault(require("./config/sequelize"));
const auth_1 = __importDefault(require("./routes/auth"));
const task_1 = __importDefault(require("./routes/task"));
const app = (0, express_1.default)();
const PORT = 4000;
app.use(express_1.default.json());
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
};
app.use(loggingMiddleware);
app.use("/auth", auth_1.default);
app.use("/task", task_1.default);
app.listen(PORT, async () => {
    await sequelize_1.default.authenticate();
    console.log("Database connected successfully.");
    console.log(`Server is running on http://localhost:${PORT}`);
});
