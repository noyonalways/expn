import express, { Application, NextFunction, Request, Response } from "express";
import { db } from "./database/db";

const app: Application = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

/**\
 * ========================
 * Use cases
 * ========================
 */

app.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and password are required",
      });
    }

    // check if user already exists
    const existingUser = db.chain.get("users").find({ email }).value();

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    /**
     * Mock password hashing
     * TODO: implement real hashing algorithm
     */

    const hashedPassword = `hashed_${password}`;

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    };

    db.data.users.push(newUser);
    await db.write();

    // remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

app.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // find user
    const user = db.chain.get("users").find({ email }).value();
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // mock password verification
    const hashedPassword = `hashed_${password}`;
    if (user.password !== hashedPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // mock token generation
    const token = `dummy_token_give_me_access`;

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// ========================

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    status: "error",
    message: error.message || "Internal server error",
  });
});

export default app;
