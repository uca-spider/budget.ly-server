import moment from "moment";
import Transaction from "../models/Transaction.js";

// Create a new transaction
export const createTransaction = async (req, res) => {
  const { amount, type, category, description, date } = req.body;

  try {
    const newTransaction = new Transaction({
      userId: req.user.id, // Data dari token
      amount,
      type,
      category,
      description,
      date,
    });

    await newTransaction.save();

    res.status(201).json({
      status: "success",
      message: "Transaction added successfully",
      data: newTransaction,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to add transaction",
      error: error.message,
    });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    res.status(200).json({
      status: "success",
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve transactions",
      error: error.message,
    });
  }
};

// Get transactions by type (Income or Expense)
export const getTransactionsByType = async (req, res) => {
  const { type } = req.params;

  try {
    // Validate type
    if (!["Income", "Expense"].includes(type)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid transaction type. Allowed values are 'Income' or 'Expense'.",
      });
    }

    const transactions = await Transaction.find({ userId: req.user.id, type });

    res.status(200).json({
      status: "success",
      message: `${type} transactions retrieved successfully`,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to retrieve ${type} transactions`,
      error: error.message,
    });
  }
};


// Get transaction summary (total income, total expense, balance)
export const getTransactionSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "Expense") {
        totalExpense += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      status: "success",
      message: "Transaction summary retrieved successfully",
      data: {
        totalIncome,
        totalExpense,
        balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve transaction summary",
      error: error.message,
    });
  }
};

// Get income and expense for the current month
export const getMonthlyTransactions = async (req, res) => {
  try {
    // Tentukan rentang tanggal untuk bulan ini
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // Ambil transaksi hanya dalam bulan ini
    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "Expense") {
        totalExpense += transaction.amount;
      }
    });

    res.status(200).json({
      status: "success",
      message: "Monthly transactions summary retrieved successfully",
      data: {
        month: moment().format("MMMM YYYY"),
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve monthly transactions summary",
      error: error.message,
    });
  }
};

// Get transactions by category
export const getTransactionsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    // Ambil transaksi berdasarkan kategori dan user ID
    const transactions = await Transaction.find({ userId: req.user.id, category });

    // Periksa apakah kategori ditemukan
    if (transactions.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No transactions found for this category",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Transactions for category '${category}' retrieved successfully`,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve transactions by category",
      error: error.message,
    });
  }
};
