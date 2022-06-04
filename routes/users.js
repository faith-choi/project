const express = require("express");
const User = require("../models/user");
const Joi = require("joi");
const { ValidationError } = require("joi");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

/* const schema = Joi.object({
  a: Joi.array().items(Joi.number()),
  b: Joi.number().valid(Joi.in("a")),
});
 */
const postUsersSchema = Joi.object({
  userName: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(3)
    .max(10)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(4).disallow(Joi.ref("userName")).required(),
  confirmPassword: Joi.equal(Joi.ref("password")),
});

//회원가입 API (완료)
router.post("/users", async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body);

    if (req.headers["token"]) {
      res.status(401).send({
        errorMessage: "이미 로그인 되어 있습니다.",
      });
      return;
    }

    //username, password 일치 확인
    /*     const dup = userName
      .split("")
      .filter((value) => (value = password.split("")));
    if (dup.length > 2) {
      res.status(400).send({
        errorMessage: "닉네임과 비밀번호에 같은 값이 들어갈 수 없습니다.",
      });
      return;
    }
 */
    //email과 username 체크
    const checkUsers = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (checkUsers) {
      res.status(400).send({
        errorMEssage: "중복된 닉네임입니다.",
      });
      return;
    }

    //아이디, 비밀번호 일치여부
    const user = new User({ email, userName, password });
    await user.save();

    res.status(201).send({
      msg: "회원가입에 성공했습니다!",
    });
  } catch (e) {
    if (e instanceof ValidationError) {
    }
    res.status(400).send({
      errorMessage: "에러발생",
    });
  }
});

//로그인 API (완료)
router.post("/auth", async (req, res) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName, password }).exec();

  if (!user) {
    res.status(401).send({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
    return;
  }

  /*   //로그인 여부 확인(완료)
  const checking = req.headers["token"];
  if (checking.length) {
    res.status(401).send({
      errorMessage: "이미 로그인 되어 있습니다.",
    });
    return;
  } */

  const token = jwt.sign({ userId: user.userId }, "my-key");
  res.send({
    token,
  });
});

//사용자 정보 조회 API(완료)
router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});

module.exports = router;
