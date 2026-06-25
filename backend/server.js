require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();


// ==========================
// MIDDLEWARE
// ==========================

const apiLimiter = require("./middleware/rateLimit");
const apiLogger = require("./middleware/apiLogger");


app.use(
  cors({
    origin:"http://localhost:5173",
    credentials:true
  })
);


app.use(express.json());

app.use(
  express.urlencoded({
    extended:true
  })
);


app.use(apiLimiter);

app.use(apiLogger);



// ==========================
// ROUTES
// ==========================

const authRoutes =
require("./auth/authRoutes");


const patientRoutes =
require("./routes/patientRoutes");


const icdRoutes =
require("./routes/icdRoutes");


const dashboardRoutes =
require("./routes/dashboardRoutes");


const customApiRoutes =
require("./routes/customApiRoutes");


const batchRoutes =
require("./routes/batchRoutes");


const ledgerRoutes =
require("./routes/ledgerRoutes");   


const exportRoutes =
require("./routes/exportRoutes");


const logRoutes =
require("./routes/logRoutes");

// ==========================
// API ROUTES
// ==========================

app.use(
"/auth",
authRoutes
);


app.use(
"/patients",
patientRoutes
);


app.use(
"/icd",
icdRoutes
);


app.use(
"/dashboard",
dashboardRoutes
);


app.use(
"/custom-api",
customApiRoutes
);


app.use(
"/batch",
batchRoutes
);


app.use(
"/ledger",
ledgerRoutes
);

app.use(
  "/export",
  exportRoutes
);


app.use(
  "/logs",
  logRoutes
);


// ==========================
// HEALTH CHECK
// ==========================

app.get(
"/health",
(req,res)=>{

res.json({
status:"ok",
service:"NAMASTE ICD-11 Backend"
});

});



// ==========================
// START SERVER
// ==========================

const PORT =
process.env.PORT || 5000;


app.listen(
PORT,
()=>{
console.log(
`Server running on port ${PORT}`
);
}
);