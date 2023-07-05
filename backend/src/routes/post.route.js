const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const PostModel = require("../models/post.models");
const UserModel = require("../models/user.models");
const multer = require("multer");

// const upload = multer({ dest: "uploads/" });

const path = require("path");
const uploadDestination = path.join(__dirname, "uploads/");

const upload = multer({ dest: uploadDestination });

// Create a new post
router.post(
  "/",
  upload.single("picture"),
  asyncHandler(async (req, res) => {
    const { author, message } = req.body;

    const picture = req.file ? req.file.path : null;
    const post = await PostModel.create({
      author,
      message,
      picture,
    });
    await post.save();
    await post.populate("author");
    await UserModel.findByIdAndUpdate(author, { $push: { posts: post._id } });
    res.status(201).json(post);
  })
);

//create post who is a comment
router.post(
  "/comment",
  upload.single("picture"),
  asyncHandler(async (req, res) => {
    const { postId, author, message, isCommentOf } = req.body;

    const picture = req.file ? req.file.path : null;
    const post = await PostModel.create({
      author,
      message,
      picture,
      isCommentOf,
    });
    await post.save();
    await post.populate("author");
    await UserModel.findByIdAndUpdate(author, {
      $push: { comments: post._id },
    });
    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: post._id },
    });

    res.status(201).json(post);
  })
);

// Get all posts
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const posts = await PostModel.find({ isCommentOf: { $size: 0 } })
      .populate("author")
      .sort({ createdAt: -1 })
      .exec();

    if (!posts) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(201).json(posts);
  })
);

// Get all my likes
router.get(
  "/likes/:id",
  asyncHandler(async (req, res) => {
    const listPostsLikes = await UserModel.findById(req.params.id, "likes")
      .populate({
        path: "likes",
        options: {
          sort: { createdAt: -1 },
        },
        populate: "author",
      })
      .exec();

    console.log(listPostsLikes);
    if (!listPostsLikes.likes) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(201).json(listPostsLikes.likes);
  })
);

// Get a specific post by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  })
);

// Update a post by ID
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  })
);

router.patch(
  "/like/yo",
  asyncHandler(async (req, res) => {
    const { myUserId, postId } = req.body;
    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $push: { likes: myUserId } },
      {
        new: true,
      }
    ).populate("author");

    await UserModel.findByIdAndUpdate(myUserId, { $push: { likes: postId } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  })
);

router.patch(
  "/unlike/yo",
  asyncHandler(async (req, res) => {
    const { myUserId, postId } = req.body;
    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: myUserId } },
      {
        new: true,
      }
    ).populate("author");

    await UserModel.findByIdAndUpdate(myUserId, { $pull: { likes: postId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  })
);

router.get(
  "/detail/:id",
  asyncHandler(async (req, res) => {
    const post = await PostModel.findById(req.params.id)
      .populate({
        path: "author",
      })
      .populate({
        path: "comments",
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: "author",
        },
      });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  })
);

// Delete a post by ID
router.delete(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    const postId = req.params.id;
    const post = await PostModel.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the references in other documents
    await UserModel.findByIdAndUpdate(userId, {
      $pull: {
        posts: postId,
        likes: postId,
        comments: postId,
      },
    });

    await UserModel.updateMany({
      $pull: {
        likes: postId,
      },
    });

    await PostModel.updateMany({
      $pull: {
        comments: postId,
      },
    });

    //Update the references in other posts' comments
    await PostModel.deleteMany({ isCommentOf: postId });

    res.json(postId);
  })
);

module.exports = router;
