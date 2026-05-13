const express = require("express");

const app = express();

const patientRoutes = require("./routes/patientRoutes");
const icdRoutes = require("./routes/icdRoutes");


// Middleware
app.use(express.json());


// Routes
app.use("/", patientRoutes);
app.use("/icd", icdRoutes);


// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


// Server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});