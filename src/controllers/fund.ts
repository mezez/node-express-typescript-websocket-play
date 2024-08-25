import { NextFunction, Request, Response } from "express";
import { clients } from "../helpers/server_socket";
import { ResponseInterface } from "../interfaces/response";
import { Fund } from "../models/fund";
import {
  contributeToFund,
  createFund,
  joinFund,
  notifyUsersOfFunding,
} from "../services/fund";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let responseData: ResponseInterface = {
    message: "",
    data: {},
  };

  if (!req.body) {
    responseData.message = "Invalid request";
    return res.status(400).send(responseData);
  }

  const operationResponse = await createFund(req.body.user_id, req.body.name);

  if (operationResponse.error) {
    next(operationResponse.error);
  }

  responseData.message = operationResponse.message;
  responseData.data = operationResponse.fund;
  return res.status(operationResponse.status).send(responseData);
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  let responseData: ResponseInterface = {
    message: "",
    data: {},
  };

  try {
    const funds = await Fund.find();
    responseData.message = "Funds list";
    responseData.data = funds;
    return res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

export const join = async (req: Request, res: Response, next: NextFunction) => {
  let responseData: ResponseInterface = {
    message: "",
    data: {},
  };
  if (!req.body) {
    responseData.message = "Invalid request";
    return res.status(400).send(responseData);
  }

  const { user_id, fund_id } = req.body;

  const operationResponse = await joinFund(user_id, fund_id);

  if (operationResponse.error) {
    next(operationResponse.error);
  }

  responseData.message = operationResponse.message;
  responseData.data = operationResponse.fund;
  return res.status(operationResponse.status).send(responseData);
};

export const contribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let responseData: ResponseInterface = {
    message: "",
    data: {},
  };
  if (!req.body) {
    responseData.message = "Invalid request";
    return res.status(400).send(responseData);
  }

  const { user_id, fund_id, amount } = req.body;

  const operationResponse = await contributeToFund(user_id, fund_id, amount);

  if (operationResponse.error) {
    next(operationResponse.error);
  }

  responseData.message = operationResponse.message;
  if (operationResponse.fund) {
    responseData.data = operationResponse.fund;
  }
  await notifyUsersOfFunding(clients, fund_id);
  return res.status(operationResponse.status).send(responseData);
};
