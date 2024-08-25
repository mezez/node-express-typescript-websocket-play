import { IUser, User } from "../models/user";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ResponseInterface } from "../interfaces/response";
import { config } from "../config";

export const create = async (
  name: string,
  email: string,
  password: string,
  next: NextFunction
): Promise<{ status: number; response: ResponseInterface }> => {
  let response: ResponseInterface = { message: "", data: {} };
  let status = 400;
  try {
    const user = await User.create({ name, email, password });

    status = 200;
    response = {
      message: "User created successfully!",
      data: user,
    };
  } catch (error) {
    next(error);
  }
  return { status, response };
};

export const authenticate = async (
  email: string,
  password: string,
  next: NextFunction
): Promise<{ status: number; response: ResponseInterface }> => {
  let response: ResponseInterface = { message: "", data: {} };
  let status = 400;

  try {
    const doc: IUser | null = await User.findOne({ email });

    if (doc) {
      const isMatch: boolean = await User.comparePassword(
        password,
        doc.password
      );

      if (isMatch) {
        const token = jwt.sign(
          { userId: doc._id.toString(), email },
          config.jwtHash,
          { expiresIn: "100 days" }
        );

        status = 200;
        response = {
          message: "Authentication successful!",
          data: { token, doc },
        };
      } else {
        response = { message: "Invalid Credentials", data: {} };
      }
    } else {
      response = { message: "Invalid Credentials", data: {} };
    }
  } catch (error) {
    next(error);
  }

  return { status, response };
};
