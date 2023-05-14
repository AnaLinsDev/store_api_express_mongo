const getAllProductsStatic = async (req, res) => {
  throw new Error('testing error async')
    res.status(200).json({ msg: "testing route static" });
};

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: "testing route" });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
