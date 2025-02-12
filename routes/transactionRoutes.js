import express from "express";
import { createTransaction, getTransactions, getTransactionsByType, getTransactionSummary, getMonthlyTransactions, getTransactionsByCategory} from "../controllers/transactionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTransaction); // Tambah transaksi
router.get("/", authMiddleware, getTransactions);   // Ambil semua transaksi pengguna
router.get("/type/:type", authMiddleware, getTransactionsByType);  // Endpoint baru
router.get("/summary", authMiddleware, getTransactionSummary);
router.get("/monthly-summary", authMiddleware, getMonthlyTransactions);
router.get("/category/:category", authMiddleware, getTransactionsByCategory);

export default router;
