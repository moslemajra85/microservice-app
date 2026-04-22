import express from "express";

const app = express();

const PORT = 5004;

app.use(express.json());

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:5001";
const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:5002";
const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5003";

let nextOrderId = 1;
const orders = [];

// helper functions

// getting the product details from the product service

async function getProductById(productId) {
  try {
    const response = await fetch(
      `${PRODUCT_SERVICE_URL}/products/${productId}`,
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

// process the Payment using the payment service
async function processPayment(orderId, amount) {
  try {
    const response = await fetch(`${PAYMENT_SERVICE_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ orderId, amount }),
    });

    const data = await response.json();
    if (!response.ok) {
      return null;
    }

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function sendNotification(orderId, message) {
  try {
    const response = await fetch(`${NOTIFICATION_SERVICE_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ orderId, message }),
    });

    const data = await response.json();
    if (!response.ok) {
      return null;
    }

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/orders", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const numericProductId = Number(productId);
    const numericQuantity = Number(quantity);

    if (!Number.isInteger(numericProductId) || !Number.isFinite(numericQuantity)) {
      return res.status(400).json({
        message: "Valid productId and quantity are required",
      });
    }

    if (numericQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // step1: get product details from Product service
    const product = await getProductById(numericProductId);

    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    // step2 : Calculate the total amount
    const totalAmount = product.price * numericQuantity;

    const orderId = nextOrderId++;

    // step3: Process The Payement using the payment service
    const payment = await processPayment(orderId, totalAmount);

    if (!payment) {
      return res.status(400).json({
        message: "Payment failed",
      });
    }

    // step4

    const order = {
      id: orderId,
      productId: numericProductId,
      quantity: numericQuantity,
      totalAmount,
      payment,
      status: "confirmed",
    };

    orders.push(order);

    // step5: Send Notification to the customer using notification service
    await sendNotification(orderId, `Your order ${orderId} is confirmed`);

    return res.status(201).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to create order",
    });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Failed to start Order Service:", error.message);
    process.exit(1);
  }

  console.log(`Order Service is running on http://localhost:${PORT}`);
});
