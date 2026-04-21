import express from "express";

const app = express();

app.use(express.json());

const PORT = 5003;

app.post("/notifications", (req, res) => {
  const { orderId, message } = req.body;

  if (!orderId || !message) {
    return res.status(400).json({
      status: "FAILED",
      message: "orderId and message is required",
    });
  }

  console.log("Notification sent successfully");
  // if Success
  res.status(200).json({
    status: "Success",
    orderId,
    message,
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Failed to start Notification Service:", error.message);
    process.exit(1);
  }

  console.log(
    `Notification service is running on port http://localhost:${PORT}`,
  );
});
