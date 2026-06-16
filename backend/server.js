require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// middleware
const apiLimiter = require("./middleware/rateLimit");
const apiLogger = require("./middleware/apiLogger");

// routes
const authRoutes = require("./auth/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const icdRoutes = require("./routes/icdRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const customApiRoutes = require("./routes/customApiRoutes");
const batchRoutes = require("./routes/batchRoutes");

// CORE MIDDLEWARE (ORDER MATTERS)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);
app.use(apiLogger);

// ROUTES
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/icd", icdRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/custom-api", customApiRoutes);
app.use("/batch", batchRoutes);

// health checkxx
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});