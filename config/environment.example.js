var environments = {
  development: {
    port: "PORT",
    jwt_secret: "secret-key",
    mongodb: {
      database: "DB_NAME"
    },
    mysql: {
      host: "DB_HOST",
      user: "DB_USER",
      password: "DB_PASSWORD",
      database: "DB_NAME"
    }
  }
};

var nodeEnv = process.env.NODE_ENV || "development";

console.log("This Mode is", nodeEnv, "Mode");

module.exports = environments[nodeEnv];
