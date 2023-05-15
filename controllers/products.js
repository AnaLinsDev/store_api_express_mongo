const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  // $gt -> greater than
  // .select -> what fields you want to be return
  const products = await Product.find({ price: { $gt: 60 } })
    .sort("price")
    .select("name price");

  res.status(200).json({ products, quant: products.length });
  //res.status(200).json({ products, quant: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;
  const queryObject = {};

  // Product fields
  if (featured) {
    queryObject.featured = featured;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
    // $regex: name -> search to any name with the value of req.query.name
    // $options: 'i' ->  case sensitive
    // https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-regex
  }

  // ________________________________

  // Sort
  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  // example sort: /products?name=a&sort=name,price

  // ________________________________

  // Fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  // example fields: /products?name=a&fields=name,price,company

  // ________________________________

  /*
     Other options:
     - .limit(10) -> limit the quantity to 10
     - .skip(5) -> skip first 5 items
  */

  const products = await result.limit(5);

  res.status(200).json({ products, quant: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
