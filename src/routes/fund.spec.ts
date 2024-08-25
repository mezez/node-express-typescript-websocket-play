// import request from "supertest";
// import express from "express";
// import fundRouter from "./fund"; // Adjust the path accordingly
// import { createFund } from "../services/fund"; // Mock service if needed

// jest.mock("../services/fund"); // Mock the service layer to control its behavior in tests
// jest.mock("../helpers/auth_middleware", () => ({
//   checkToken: (req: any, res: any, next: any) => next(),
// })); // Mock middleware to bypass authentication for tests

// const app = express();
// app.use(express.json()); // To parse JSON request bodies
// app.use("/fund", fundRouter);

// describe("Fund Routes", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("POST /fund", () => {
//     it("should return 400 if validation fails", async () => {
//       const response = await request(app)
//         .post("/fund")
//         .send({ user_id: "", name: "" }); // Sending invalid data

//       expect(response.status).toBe(400);
//       expect(response.body.message).toBe("Invalid user data");
//     });

//     it("should create a fund if data is valid", async () => {
//       (createFund as jest.Mock).mockResolvedValue({
//         message: "Fund creation successful",
//         status: 200,
//         fund: { id: "testFundId", name: "Test Fund", user_id: "testUserId" },
//         error: null,
//       });

//       const response = await request(app)
//         .post("/fund")
//         .send({ user_id: "testUserId", name: "Test Fund" }); // Sending valid data

//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe("Fund creation successful");
//     });
//   });

//   describe("POST /fund/join", () => {
//     it("should return 400 if validation fails", async () => {
//       const response = await request(app)
//         .post("/fund/join")
//         .send({ user_id: "", fund_id: "" }); // Sending invalid data

//       expect(response.status).toBe(400);
//       expect(response.body.message).toBe("Invalid user data");
//     });

//     // Add more tests as needed for successful join, etc.
//   });

//   // Add more describe blocks for other routes (e.g., POST /fund/contribute, GET /fund, etc.)
// });
