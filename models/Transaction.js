import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        validate: {
          validator: (value) => value > 0,
          message: "Amount must be greater than 0",
        },
      },
      type: {
        type: String,
        enum: ["Income", "Expense"],
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        required: true,
        validate: {
          validator: (value) => value <= new Date(),
          message: "Date cannot be in the future",
        },
      },
    },
    {
      timestamps: true,
    }
  );
  
  export default mongoose.model("Transaction", transactionSchema);
  