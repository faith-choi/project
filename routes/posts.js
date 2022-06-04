const express = require("express");
const mongoose = require("mongoose");
const Posts = require("../schemas/posts");
const User = require("../models/user");
const Comments = require("../schemas/comments");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//게시글 전체조회(완료)
router.get("/post", async (req, res) => {
  const posts = await Posts.find().sort({ date: -1 });
  res.json({
    posts,
  });
});

//게시글 상세조회(완료)
router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const detail = await Posts.find({ postId: Number(postId) });
  const comments = await Comments.find({ postId: Number(postId) }).sort({
    commentId: -1,
  });

  res.json({
    detail,
    comments,
  });
});

//게시글 등록(완료)
router.post("/post", authMiddleware, async (req, res) => {
  const { postId, title, content } = req.body;
  const { userName } = res.locals.user;

  const createdPosts = await Posts.create({
    postId,
    title,
    userName,
    content,
    date: new Date(),
  });

  res.status(201).json({ msg: "등록되었습니다." });
});

//게시글 수정(완료)
router.put("/post/:postId", authMiddleware, async (req, res) => {
  const { userName } = res.locals.user;
  const { postId } = req.params;
  const { content } = req.body;

  const checkContent = await Posts.findOne({ postId: Number(postId) });
  if (checkContent["userName"] !== userName) {
    return res
      .status(400)
      .send({ success: false, errorMessage: "수정할 수 없습니다." });
  }

  await Posts.updateOne({ postId }, { $set: { content } });

  res.json({ success: "수정 완료!" });
});

//게시글 삭제(완료)
router.delete("/post/:postId", authMiddleware, async (req, res) => {
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
