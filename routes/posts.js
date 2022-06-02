const express = require("express");
const Posts = require("../schemas/posts");
const User = require("../models/user");
const Comments = require("../schemas/comments");
const jwt = require("JsonWebToken");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//게시글 전체조회(완료)
router.get("/", async (req, res) => {
  const posts = await Posts.find().sort({ date: -1 });
  res.json({
    posts,
  });
});

//게시글 상세조회(완료)
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const [detail] = await Posts.find({ postId });

  const comments = await Comments.find({ postId }).sort({ date: -1 });

  res.json({
    detail,
    comments,
  });
});

//게시글 등록(완료)
router.post("/posts", authMiddleware, async (req, res) => {
  const { userName, title, content } = req.body;

  const maxPostId = await Posts.findOne().sort("-postId").exec();
  let postId = 1;

  if (maxPostId) {
    postId = maxPostId.postId + 1;
  }

  const createdPosts = await Posts.create({
    postId,
    userName,
    title,
    content,
    date: new Date(),
  });

  res.status(201).json({ msg: "등록되었습니다." });
});

//게시글 수정(완료)
router.put("/:postId"),
  authMiddleware,
  async (req, res) => {
    const { userName } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;

    const checkContent = await Posts.findOne({ postId: Number(postId) });
    if (checkContent["userName"] !== userName) {
      return res
        .status(400)
        .send({ success: false, errorMessage: "수정할 수 없습니다." });
    }

    await Posts.updateOne({ postId }, { $set: { content } });

    res.json({
      success: "수정 완료!",
    });
  };

//게시글 삭제(완료)
router.delete("/:postId", authMiddleware, async (req, res) => {
  const { userName } = res.locals.user;
  const { postId } = req.params;
  const { content } = req.body;

  const checkContent = await Posts.findOne({ postId: Number(postId) });
  if (checkContent["userName"] !== userName) {
    return res
      .status(400)
      .send({ success: false, errorMessage: "삭제할 수 없습니다." });
  }

  await Posts.deleteOne({ postId });

  res.json({ success: true, msg: "삭제되었습니다." });
});

module.exports = router;
