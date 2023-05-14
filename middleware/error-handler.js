const errorHandlerMiddleware = async (err, req, res, next) => {
  return res
    .status(500)
    .json({
      generic_message: "Something went wrong, please try again",
      message: err.message || '',
    });
};

module.exports = errorHandlerMiddleware;
