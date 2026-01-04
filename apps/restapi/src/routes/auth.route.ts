import { CreateNewUserUseCase } from "@expn/core/use_cases/create-new-user";
import { HashPassword } from "@expn/core/interfaces/HashPassword";
import { JsonWebToken } from "@expn/core/interfaces/JsonWebToken";
import { Logger } from "@expn/core/interfaces/Logger";
import { Application, Request, Response, Router } from "express";
import { UserLoginUseCase } from "@expn/core/use_cases/user-login";
import { InMemoryUserRepository } from "@expn/database/adapters/in_memory/impl_user.repository";

type Dependencies<T> = {
  hashPassword: HashPassword;
  jsonWebToken: JsonWebToken<T>;
  logger: Logger;
};

export const authRoutes = <T>(app: Application, deps: Dependencies<T>) => {
  const router: Router = Router();

  router.post("/register", async (req: Request, res: Response) => {
    // DO Whatever you want with the request object

    // Resolved the dependencies
    const createUser = new CreateNewUserUseCase(
      new InMemoryUserRepository(),
      deps.hashPassword,
      deps.logger
    );

    // Execute the use case
    const user = await createUser.execute({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Return the response
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  });

  router.post("/login", async (req: Request, res: Response) => {
    // DO Whatever you want with the request object

    // Resolved the dependencies
    const loginUser = new UserLoginUseCase(
      new InMemoryUserRepository(),
      deps.hashPassword,
      deps.jsonWebToken
    );

    const token = await loginUser.execute(req.body.email, req.body.password);

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  });

  app.use("/auth", router);
};
