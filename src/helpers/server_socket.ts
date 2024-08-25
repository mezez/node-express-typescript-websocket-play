import WebSocket from "ws";
import dotenv from "dotenv";
import { Fund } from "../models/fund";
import mongoose from "mongoose";

const port = process.env.WEBSOCKET_PORT;

// export // A map to store client connections by user ID
export const clients: { [userId: string]: WebSocket } = {};

export const webSocketServer = () => {
  const wss = new WebSocket.Server({ port: Number(port) });

  console.log("Websocket server started");

  wss.on("connection", (ws: WebSocket) => {
    console.log("Connected: " + ws);

    ws.send("connection received");

    ws.on("message", async (message: string) => {
      console.log(message);

      try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.user_id) {
          const userId: any = new mongoose.Types.ObjectId(
            parsedMessage.user_id
          );

          clients[parsedMessage.user_id] = ws;

          console.log(clients);

          const funds = await Fund.find({ users: userId });

          if (funds) {
            const data = { messages: "your funds", funds };

            ws.send(JSON.stringify(data));
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
};

// {"user_id":"66ca0535530cb2db433e7bb5"}
// {"user_id":"66ca11416a58fa83a2da8ad1"}
// {"user_id":"66ca3c5bcacdb698318cebe4"}
