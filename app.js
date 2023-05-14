require("dotenv").config();
require('express-async-errors');

const express = require("express");

const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');


const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());


// routes
app.get("/", (req, res) => {
  res.send('STORE API <a href="/api/v1/products">products route</a>');
});

app.use('/api/v1/products', productsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start()
