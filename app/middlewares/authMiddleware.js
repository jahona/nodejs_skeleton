(function() {
  "use strict";
})();

const jwt = require("jsonwebtoken");
const env = require("../../config/environment");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.query.token;

  if (!token) {
    return res.status(403).json({
      error: "error.The user don't have token"
    });
  }

  await jwt.verify(token, env.jwt_secret, function(error, decoded) {
    if (error) {
      res.status(403).json({
        error: {
          message: error,
          code: 0
        }
      });
    } else {
      req.decoded = decoded;

      next();
    }
  });
};

module.exports = authMiddleware;
