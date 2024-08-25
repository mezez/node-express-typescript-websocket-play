import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import {} from "jsonwebtoken";
import { ResponseInterface } from "../interfaces/response";
import { authenticate, create } from "../services/user";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body;

  const { name, email, password } = user;

  if (!name || !email || !password) {
    const response: ResponseInterface = {
      message: "Name, email and password are required",
    };
    return res.status(400).send({ response });
  }

  // todo validate email uniqueness

  //create user
  const response = await create(name, email, password, next);
  return res.status(response.status).send(response.response);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const authenticationResponse = await authenticate(email, password, next);

  return res
    .status(authenticationResponse.status)
    .send(authenticationResponse.response);
};
