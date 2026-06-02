const express = require("express");
const cors = require("cors");

const app = express();

// middleware FIRST
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// routes
const patientRoutes = require("./routes/patientRoutes");
const icdRoutes = require("./routes/icdRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/", patientRoutes);
app.use("/icd", icdRoutes);
app.use("/dashboard", dashboardRoutes);

// health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// root fix
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});