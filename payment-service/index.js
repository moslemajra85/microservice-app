import express from "express";

const app = express();

const PORT = 5002;

app.use(express.json());

app.post("/payments", (req, res) => {
  const { orderId, amount } = req.body;
  const numericAmount = Number(amount);

  if (!orderId || !Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      status: "FAILED",
      message: "Valid orderId and amount are required",
    });
  }

  if (numericAmount > 2000) {
    return res.status(400).json({
      status: "FAILED",
      message: "Amount must be less than 2000",
    });
  }

  // if success
  res.status(200).json({
    status: "success",
    transactionId: `TX-${Date.now()}`,
    orderId,
    amount: numericAmount,
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Failed to start Payment Service:", error.message);
    process.exit(1);
  }

  console.log(`Payment service is running on port http://localhost:${PORT}`);
});
