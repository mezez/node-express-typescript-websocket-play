import express, { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator/lib/validation-result";

import { register, login } from "../controllers/user";
import { ResponseInterface } from "../interfaces/response";

const userRouter: Router = express.Router();

const registerValidators: any[] = [
  body("email", "Invalid email").isEmail(),
  body("password", "password cannot be Empty").not().isEmpty(),
];

userRouter.post(
  "/register",
  registerValidators,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseData: ResponseInterface = {
        message: "Invalid user data",
        data: errors.array(),
      };
      return res.status(400).send(responseData);
    }

    return register(req, res, next);
  }
);

userRouter.post(
  "/login",
  registerValidators,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseData: ResponseInterface = {
        message: "Invalid credentials data",
        data: errors.array(),
      };
      return res.status(400).send(responseData);
    }

    return login(req, res, next);
  }
);

export default userRouter;
