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

  describe("create fund", () => {
    it("should return 404 if user is not found", async () => {
      //arrange
      const userId = "ijgknfd";
      const name = "jkkjjk";

      //mock user find by id
      (User.findById as jest.Mock).mockResolvedValue(null);

      //   jest
      //     .spyOn(fundModule, "createFund")

      //act
      const response = await fundModule.createFund(userId, name);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(response.status).toBe(404);
      expect(response.message).toBe("Invalid user id");
      expect(response.fund).toBe(null);
    });
  });
});
