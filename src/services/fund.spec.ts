import { describe } from "node:test";

import * as fundModule from "./fund";

import { User } from "../models/user";
import { Fund } from "../models/fund";

// Mock the User and Fund models
jest.mock("../models/user");
jest.mock("../models/fund");

describe("fund", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fundId = "test_fund_id";
  const userId = "test_user_id";
  const fundName = "test fund";
  const userName = "test user";

  const mockFund = {
    _id: fundId,
    name: fundName,
    balance: 20,
    previous_balance: 0,
    user_id: userId,
    users: [userId],
  };

  const mockUser = {
    _id: userId,
    name: userName,
  };

  describe("createFund", () => {
    it("should return 404 if user is not found", async () => {
      //arrange

      //mock user find by id
      (User.findById as jest.Mock).mockResolvedValue(null);

      //   jest
      //     .spyOn(fundModule, "createFund")

      //act
      const response = await fundModule.createFund(userId, fundName);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(response.status).toBe(404);
      expect(response.message).toBe("Invalid user id");
      expect(response.fund).toBe(null);
    });

    it("should create fund", async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Fund.create as jest.Mock).mockResolvedValue(mockFund);

      const response = await fundModule.createFund(userId, fundName);

      expect(response.fund).toEqual(mockFund);
      expect(response.status).toBe(200);
      expect(response.message).toBe("Fund creation successful");
    });

    it("should return error when something goes wrong", async () => {
      (User.findById as jest.Mock).mockImplementation(() => {
        throw new Error("Something went wrong");
      });
      const response = await fundModule.createFund(userId, fundName);

      expect(response.message).toMatch("Error");
      expect(response.status).toBe(500);
      console.log(response.error);
    });
  });
});
