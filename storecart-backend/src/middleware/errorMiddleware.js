function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV !== "production") {
    return res.status(status).json({ success: false, message, stack: err.stack });
  }
  return res.status(status).json({ success: false, message });
}

module.exports = { errorHandler };
