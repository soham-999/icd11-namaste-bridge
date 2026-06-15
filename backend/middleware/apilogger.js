const db = require("../db");

const apiLogger = async (req, res, next) => {
  const originalSend = res.send.bind(res);

  res.send = async function (body) {
    try {
      await db.query(
        `
        INSERT INTO api_logs
        (
          username,
          endpoint,
          method,
          request_body,
          payload,
          status_code
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6
        )
        `,
        [
          req.user?.username || "anonymous",
          req.originalUrl,
          req.method,
          JSON.stringify(req.body || {}),
          typeof body === "string"
            ? body
            : JSON.stringify(body || {}),
          res.statusCode
        ]
      );
    } catch (err) {
      console.log("Log error:", err.message);
    }

    return originalSend(body);
  };

  next();
};

module.exports = apiLogger;