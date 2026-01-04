import express, { Application, NextFunction, Request, Response } from "express";
import { BcryptjsHashPassword, ConsoleLogger, JsonWebTokenImpl } from "@expn/shared";
import cors from 'cors'
import { authRoutes } from "./routes/auth.routes";
import { accountRoutes } from "./routes/account.routes";

const logger = new ConsoleLogger()
const hashPassword = new BcryptjsHashPassword()
const jsonWebToken = new JsonWebTokenImpl

const app: Application = express();

app.use(express.json());
app.use(cors())

// auth routes
authRoutes(app, {
  hashPassword,
  jsonWebToken,
  logger,
})


// account routes
accountRoutes(app, {
  logger,
})


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});


app.use((_req, _res, next) => {
	next(new Error('Not Found'));
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    status: "error",
    message: error.message || "Internal server error",
  });
});

export default app;
