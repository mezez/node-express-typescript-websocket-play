import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export const checkToken = (req: any, res: Response, next: NextFunction) => {
  //  console.log(req.headers);
  let token: any =
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.headers["Authorization"] ||
    null; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    if (token.startsWith("Token ")) {
      // Remove Token from string
      token = token.slice(6, token.length);
    }
  } else {
    return res.status(401).send({
      message: "Token is not valid",
    });
  }

  if (token) {
    jwt.verify(token, config.jwtHash, (err: any, decoded: any) => {
      if (err) {
        console.log(err);

        return res.status(401).send({
          message: "Token is not valid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({
      message: "Token is not valid",
    });
  }
};

export const verifyInviteToken = async (token: any) => {
  if (token) {
    let _decoded = null;
    _decoded = await jwt.verify(
      token,
      config.jwtHash,
      (err: any, decoded: any) => {
        if (err) {
          console.log(err);

          return false;
        } else {
          return decoded;
        }
      }
    );
    return _decoded;
  } else {
    return false;
  }
};
