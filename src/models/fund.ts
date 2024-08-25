import mongoose from "mongoose";

const fundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    previous_balance: {
      type: Number,
      required: true,
      default: 0.0,
    },
    balance: {
      type: Number,
      required: true,
      default: 0.0,
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Fund = mongoose.model("Fund", fundSchema);
