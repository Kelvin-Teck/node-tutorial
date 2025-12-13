import express, { NextFunction, Request, Response } from "express";
import sequelize from "./config/sequelize";
import User from "./models/user";

import authRouter from "./routes/auth";
import taskRouter from "./routes/task";
import cors from "cors";

const app = express();

const PORT = 4000;

app.use(express.json());
app.use(cors());


const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

app.use(loggingMiddleware);

app.use("/auth", authRouter);
app.use("/task", taskRouter)

app.listen(PORT, async () => {
  await sequelize.authenticate()
  console.log("Database connected successfully.");
  console.log(`Server is running on http://localhost:${PORT}`);
});
