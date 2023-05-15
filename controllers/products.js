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
  const { featured, company, name, sort, fields, numericFilters } = req.query;
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
  
  // Numeric Filters
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    // filters === price-$gt-90

    const options = ["price", "rating"];

    // Validate that the field on "numericFilters" were the valid values of "options"
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
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

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  // ________________________________

  /*
     Other options:
     - .limit(10) -> limit the quantity to 10
     - .skip(5) -> skip first 5 items
  */

  const products = await result;

  res.status(200).json({ quant: products.length, products });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
