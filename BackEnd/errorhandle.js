function errorHandler(err, req, res, next) {
  console.error("An error occurred:", err);
  res.status(500).json({ message: "Something went wrong" });
}

module.exports = errorHandler;
