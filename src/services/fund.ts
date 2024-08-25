import { NextFunction } from "express";
import mongoose, { Document } from "mongoose";
import { Fund } from "../models/fund";
import { User } from "../models/user";

interface FundResponse {
  message: string;
  status: number;
  fund: Document | null;
  error: any;
}

export const createFund = async (
  userId: string,
  name: string
): Promise<FundResponse> => {
  let responseData: FundResponse = {
    message: "",
    status: 200,
    fund: null,
    error: null,
  };

  try {
    const user = await User.findById(userId);

    if (!user) {
      responseData.message = "Invalid user id";
      responseData.status = 404;
      return responseData;
    }
    const fund = await Fund.create({
      user_id: userId,
      name: name,
      users: [user],
    });

    responseData.message = "Fund creation successful";
    responseData.status = 200;
    responseData.fund = fund;

    return responseData;
  } catch (error) {
    responseData.message = "Error";
    responseData.status = 500;
    responseData.error = error;
    return responseData;
  }
};

export const joinFund = async (
  userId: string,
  fundId: string
): Promise<FundResponse> => {
  let responseData: FundResponse = {
    message: "",
    status: 200,
    fund: null,
    error: null,
  };

  try {
    const fund = await Fund.findById(fundId);

    if (!fund) {
      responseData.message = "Mutual fund not found";
      responseData.status = 404;
      return responseData;
    }

    if (fund.users.includes(new mongoose.Types.ObjectId(userId))) {
      responseData.message = "User is already a part of this fund";
      responseData.status = 400;
      return responseData;
    }

    //add user to fund
    fund.users.push(new mongoose.Types.ObjectId(userId));
    const updatedFund = await fund.save();

    responseData.message = "User addition successful";
    responseData.status = 200;
    responseData.fund = updatedFund;

    return responseData;
  } catch (error) {
    responseData.message = "Error";
    responseData.status = 500;
    responseData.error = error;
    return responseData;
  }
};

export const contributeToFund = async (
  userId: string,
  fundId: string,
  amount: number
): Promise<FundResponse> => {
  let responseData: FundResponse = {
    message: "",
    status: 200,
    fund: null,
    error: null,
  };

  try {
    const fund = await Fund.findById(fundId);

    if (!fund) {
      responseData.message = "Mutual fund not found";
      responseData.status = 404;
      return responseData;
    }

    if (!fund.users.includes(new mongoose.Types.ObjectId(userId))) {
      responseData.message = "User is not a part of this fund";
      responseData.status = 403;
      return responseData;
    }

    const previousBalance = fund.balance;
    fund.previous_balance = previousBalance;
    fund.balance += amount;

    const updatedFund = await fund.save();

    responseData.message = "Contribution successful";
    responseData.status = 200;
    responseData.fund = updatedFund;

    return responseData;
  } catch (error) {
    responseData.message = "Error";
    responseData.status = 500;
    responseData.error = error;
    return responseData;
  }
};

export const notifyUsersOfFunding = async (
  clients: any,
  fundId: string
): Promise<void> => {
  const fund = await Fund.findById(fundId);

  if (fund) {
    const clientsUserIds = Object.keys(clients);

    fund.users.forEach((user) => {
      console.log(user);

      if (clientsUserIds.includes(user.toString())) {
        const websocket: any = clients[user.toString()];
        const deposit = fund.balance - fund.previous_balance;
        websocket.send(
          `Mutual fund: ${fund.name} has been credit with ${deposit}`
        );
      }
    });
  }
};
