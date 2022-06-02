const express = require("express");
const Posts = require("../schemas/posts");
const Comments = require("../schemas/comments");
const jwt = require("JsonWebToken");
const authMiddleware = require("../middlewares/auth-middleware");
const { deleteOne } = require("../schemas/posts");
const router = express.Router();

//댓글 작성
router.post("/:postId", authMiddleware, async (req, res) => {
  const { userName } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;

  const maxCommentId = await Comments.findOne().sort("-commentId").exec();
  let commentId = 1;

  if (maxCommentId) {
    commentId = maxCommentId.commentId + 1;
  }

  if (comment === "") {
    res.status(400).send({
      errorMessage: "댓글 내용을 입력하세요",
    });
    return;
  }

  const createdComments = await Comments.create({
    postId,
    commentId,
    userName,
    comment,
    date: new Date(),
  });

  res.status(201).json({ msg: "등록되었습니다." });
});

//댓글 수정
router.put("/:postId/:commentId", authMiddleware, async (req, res) => {
  const { userName } = res.locals.user;
  const { commentId } = req.params;
  const { comment } = req.body;

  const checkComment = await Comments.findOne({ commentId: Number(commentId) });
  if (checkComment["userName"] !== userName) {
    return res
      .status(400)
      .send({ success: false, errorMessage: "수정할 수 없습니다." });
  }

  await Comments.updateOne(
    { commentId: Number(commentId) },
    { $set: { comment } }
  );
  res.json({ success: "수정 되었습니다." });
});

//댓글 삭제
router.delete("/:postId/:commentId", authMiddleware, async (req, res) => {
  const { userName } = res.locals.user;
  const { commentId } = req.params;
  const { comment } = req.body;

  const checkComment = await Comments.findOne({ commentId: Number(commentId) });
  if (checkComment["userName"] !== userName) {
    return res
      .status(400)
      .send({ success: false, errorMessage: "삭제할 수 없습니다." });
  }

  await Comments.deleteOne({ commentId });

  res.json({
    success: true,
    msg: "삭제되었습니다.",
  });
});

module.exports = router;
