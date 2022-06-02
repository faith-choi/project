const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://test:test123@cluster0.7utvz.mongodb.net/?retryWrites=true&w=majority"
    )
    .catch((err) => {
      console.error("MONGO DB 연결 에러", err);
    });
};

module.exports = connect;
