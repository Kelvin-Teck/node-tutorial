import express, { NextFunction, Request, Response } from "express";
import sequelize from "./config/sequelize";
import User from "./models/user";

import authRouter from "./routes/auth";

const app = express();

const PORT = 4000;

app.use(express.json());


const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

app.use(loggingMiddleware);

app.use("/auth", authRouter);


app.listen(PORT, async () => {
  await sequelize.authenticate()
  console.log("Database connected successfully.");
  console.log(`Server is running on http://localhost:${PORT}`);
});
