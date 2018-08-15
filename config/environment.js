var environments = {
  development: {
    port: 8888,
    database: "nodejs_dev"
  }
};

var nodeEnv = process.env.NODE_ENV || "development";

console.log("This Mode is", nodeEnv, "Mode");

module.exports = environments[nodeEnv];