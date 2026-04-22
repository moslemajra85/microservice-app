import express from "express";

const app = express();

const PORT = 5001;
// Products array
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    rate: 4.5,
  },
  {
    id: 2,
    name: "Mouse",
    price: 29.99,
    rate: 4.2,
  },
  {
    id: 3,
    name: "Keyboard",
    price: 79.99,
    rate: 4.7,
  },
  {
    id: 4,
    name: "Monitor",
    price: 299.99,
    rate: 4.4,
  },
  {
    id: 5,
    name: "Headphones",
    price: 149.99,
    rate: 4.6,
  },
];

// get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// get a product based on id
app.get("/products/:id", (req, res) => {
  // extract the id from the request
  const id = +req.params.id;

  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json(product);
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Failed to start Product Service:", error.message);
    process.exit(1);
  }

  console.log(`Product Service is running on port http://localhost:${PORT}`);
});
