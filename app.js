const express = require("express");
const connect = require("./schemas");
const router = express.Router();
const app = express();
const port = 8080;

connect();

const postsRouter = require("./routes/posts");
const userRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");

const requestMiddleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
};

app.use(express.json());
app.use(requestMiddleware);
app.use("/", [postsRouter, userRouter, commentsRouter]);

app.listen(port, () => {
  console.log(port, "서버 연결!🔥");
});
