const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, "my-key");

    User.findById(userId)
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
      });
    /*     if (!user) {
유저가 없을 때를 가정
    } */
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }
};