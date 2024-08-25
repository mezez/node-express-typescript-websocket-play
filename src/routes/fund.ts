import express, { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator/lib/validation-result";

import { join, contribute, create, list } from "../controllers/fund";
import { checkToken } from "../helpers/auth_middleware";
import { ResponseInterface } from "../interfaces/response";

const fundRouter: Router = express.Router();

const createValidators: any[] = [
  body("user_id", "User id cannot be empty").notEmpty().isString(),
  body("user_id", "Invalid user Id").isString(),
  body("name", "Fund name cannot be empty").notEmpty().isString(),
  body("name", "Invalid fund name").isString(),
];
const joinValidators: any[] = [
  body("user_id", "User id cannot be empty").notEmpty().isString(),
  body("user_id", "Invalid user Id").isString(),
  body("fund_id", "Fund Id cannot be empty").notEmpty(),
  body("fund_id", "Invalid fund id").isString(),
];
const contributeValidators: any[] = [
  body("user_id", "User id cannot be empty").notEmpty().isString(),
  body("user_id", "Invalid user Id").isString(),
  body("fund_id", "Fund Id cannot be empty").notEmpty(),
  body("fund_id", "Invalid fund id").isString(),
  body("amount", "Amount cannot be empty").notEmpty(),
  body("amount", "Invalid fund id").isNumeric(),
];

fundRouter.get("/", checkToken, list);

fundRouter.post(
  "/",
  checkToken,
  createValidators,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseData: ResponseInterface = {
        message: "Invalid user data",
        data: errors.array(),
      };
      return res.status(400).send(responseData);
    }

    return create(req, res, next);
  }
);

fundRouter.post(
  "/join",
  checkToken,
  joinValidators,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseData: ResponseInterface = {
        message: "Invalid user data",
        data: errors.array(),
      };
      return res.status(400).send(responseData);
    }

    return join(req, res, next);
  }
);

fundRouter.post(
  "/contribute",
  checkToken,
  contributeValidators,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseData: ResponseInterface = {
        message: "Invalid credentials data",
        data: errors.array(),
      };
      return res.status(400).send(responseData);
    }

    return contribute(req, res, next);
  }
);

export default fundRouter;
