require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("CONNECTED to the DB...");

    await Product.deleteMany();
    console.log("All products DELETED !!!");

    await Product.create(jsonProducts);
    console.log("All products CREATED !!!");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
