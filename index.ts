import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import errorHandler from "./src/helpers/error_handler";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

//hand cors
app.use(cors());

// This is required to handle urlencoded data
app.use(express.urlencoded({ extended: true }));

// This to handle json data coming from requests mainly post
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log(req);

  res.send("Express + Typescript server");
});

//Routers
import userRouter from "./src/routes/user";
import fundRouter from "./src/routes/fund";
import { webSocketServer } from "./src/helpers/server_socket";

//define routes
const prefix = "/api/v1";

app.use(prefix + "/users", userRouter);
app.use(prefix + "/funds", fundRouter);

//default error handling. See categories getAllCategories endpoint for sample usage. Call next() on error to forward to default error handler outside a promise or try block
app.use(errorHandler);

app.listen(port, async () => {
  console.log(`Server: Server is listening on port ${port}`);

  //connect to DB
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Connected to DB");

    //start a web socket
    webSocketServer();
  } catch (error) {
    console.log(error);
  }
});
