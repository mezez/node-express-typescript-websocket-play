import { Request, Response } from "express";
import { send } from "node:process";
import { describe } from "node:test";
import { createFund } from "../services/fund";

import * as fundController from "./fund";

jest.mock("../services/fund");

const fundName = "test fund";
const fundId = "test fund Id";
const userId = "test user Id";

const fundObject = { id: fundId, name: fundName, user_id: userId }; // Mock fund object

describe("fund controller", () => {
  afterEach(() => jest.clearAllMocks());

  describe("create", () => {
    const mockRequest: Partial<Request> = {
      body: {
        name: fundName,
        user_id: userId,
      },
    };

    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    it("should return 400 when there is no request body", async () => {
      const req: Partial<Request> = { ...mockRequest, body: null };
      const res = mockResponse;
      const next = jest.fn();

      const response = await fundController.create(
        req as Request,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid request",
        data: {},
      });
    });

    it("should create fund", async () => {
      const next = jest.fn();

      const mockCreateFundValue = {
        message: "Fund creation successful",
        status: 200,
        fund: fundObject,
        error: null,
      };

      (createFund as jest.Mock).mockResolvedValue(mockCreateFundValue);
      const response = await fundController.create(
        mockRequest as Request,
        mockResponse as Response,
        next
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        mockCreateFundValue.status
      );
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: mockCreateFundValue.message,
        data: mockCreateFundValue.fund,
      });
    });
  });
});
