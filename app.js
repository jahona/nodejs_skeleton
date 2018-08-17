const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const env = require("./config/environment");
const mysql = require("mysql");
const socket = require("socket.io");
const http = require("http");

var app = express();

/* express http 서버 생성 */
const server = http.createServer(app);

// http 서버를 socket.io에 바인딩
const io = socket(server);

// view
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// mongodb
mongoose.connect("mongodb://localhost:27017/" + env.mongodb.database);

const db = mongoose.connection;
db.on("error", function() {
  console.log("Connection Failed!");
});
db.once("open", function() {
  console.log("Connected!");
});

/*
// mysql
var db = mysql.createConnection({
  host: env.mysql.host,
  user: env.mysql.user,
  password: env.mysql.password,
  database: env.mysql.database
});

db.connect();
*/

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

// Routes
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "You requested index page"
  });
});

app.use("/users", require("./app/routes/users.js"));
app.use("/auth", require("./app/routes/auth.js"));
app.use("/rooms", require("./app/routes/rooms.js"));
app.use("/chats", require("./app/routes/chats.js"));

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;
  // Respond to client
  res.status(status).json({
    error: {
      message: error.message
    }
  });

  // Respond to ourselves
  console.error(err);
});

// socket.io 이벤트 등록
io.sockets.on("connection", function(socket) {
  /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
  socket.on("newUser", function(name) {
    console.log(name + " 님이 접속하였습니다.");

    /* 소켓에 이름 저장해두기 */
    socket.name = name;

    /* 모든 소켓에게 전송 */
    io.sockets.emit("update", {
      type: "connect",
      name: "SERVER",
      message: name + "님이 접속하였습니다."
    });
  });

  /* 전송한 메시지 받기 */
  socket.on("message", function(data) {
    /* 받은 데이터에 누가 보냈는지 이름을 추가 */
    data.name = socket.name;

    console.log(data);

    /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit("update", data);
  });

  /* 접속 종료 */
  socket.on("disconnect", function() {
    console.log(socket.name + "님이 나가셨습니다.");

    /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit("update", {
      type: "disconnect",
      name: "SERVER",
      message: socket.name + "님이 나가셨습니다."
    });
  });
});

//Start the Server
const port = env.port || 8888;

server.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;
