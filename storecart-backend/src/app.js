const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimiter  = require("./middleware/rateLimiter.js");
const routes = require("./routes/index.js");
const { errorHandler } = require("./middleware/errorMiddleware.js");

const app = express();

// Basic middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS - allow your frontend origin(s)
const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true, // change in prod
  credentials: true
}));

// Rate limiter (global)
console.log(rateLimiter)
app.use(rateLimiter);

// Routes
app.use("/api", routes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

// Error handler
app.use(errorHandler);

module.exports = app;
