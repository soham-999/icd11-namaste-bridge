const db = require("../db");

const apiLogger = async (req, res, next) => {
  const oldSend = res.send.bind(res);

  res.send = async function (data) {
  try {
  await db.query(
    `INSERT INTO api_logs
    (username, endpoint, requestpoint, status_code)
    VALUES ($1, $2, $3, $4)`,
    [
      req.user?.username || "anonymous",
      req.originalUrl,
      JSON.stringify(req.body || {}),
      res.statusCode
    ]
  );
} catch (err) {
  console.log("Log error:", err.message);
}

    oldSend.apply(res, arguments);
  };

  next();
};

module.exports = apiLogger;