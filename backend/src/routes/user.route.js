const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/user.models");
const PostModel = require("../models/post.models");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const verifyToken = require("../utils/tokenJwt");

// const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/" });

// Create a new user
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { pseudo, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      pseudo,
      email,
      password: hashedPassword,
    });
    res.status(201).json(user);
  })
);
// process.env.

// Connexion
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { pseudo, password } = req.body;
    const user = await UserModel.findOne({ pseudo: pseudo });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Identifiants invalides" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({ userId: user._id, token });
  })
);

// Get all users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
  })
);

// Get a specific user by ID who is not the primary user
router.get(
  "/other/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id)
      .populate({
        path: "posts",
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: "author",
        },
      })
      .populate({
        path: "comments",
        options: {
          sort: { createdAt: -1 }, // Sort by createdAt in descending order
        },
        populate: {
          path: "author",
        },
      })
      .exec();
    const isFollow = await UserModel.exists({
      _id: req.query.userId,
      following: req.params.id,
    });

    const objectReturn = {
      user: user,
      isFollow: isFollow ? true : false,
    };

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json(objectReturn);
  })
);

// Get a specific user by ID
router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id)
      .populate({
        path: "posts",
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: "author",
        },
      })
      .populate({
        path: "comments",
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: "author",
        },
      })
      .exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json(user);
  })
);

// Get a specific user by ID
router.get(
  "/name/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const nameUser = await UserModel.findById(
      req.params.id,
      "picture pseudo"
    ).exec();

    console.log(nameUser);
    if (!nameUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json(nameUser);
  })
);

// Get a specific user by ID
router.get(
  "/follower/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const listFollower = await UserModel.findById(req.params.id, "followers")
      .populate("followers")
      .exec();

    if (!listFollower.followers) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json(listFollower.followers);
  })
);

// Get a specific user by ID
router.get(
  "/following/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const listFollowing = await UserModel.findById(req.params.id, "following")
      .populate("following")
      .exec();

    if (!listFollowing.following) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json(listFollowing.following);
  })
);

// Update a user by ID
router.patch(
  "/edit",
  verifyToken,
  upload.fields([{ name: "picture" }, { name: "wallpaper" }]),
  asyncHandler(async (req, res) => {
    const { author, pseudo, bio } = req.body;

    console.log(req.files);

    const picture = req.files.picture ? req.files.picture[0].path : null;
    const wallpaper = req.files.wallpaper ? req.files.wallpaper[0].path : null;

    // Build the update object with only the provided values
    const update = {};
    if (pseudo) {
      console.log(pseudo);
      update.pseudo = pseudo;
    }
    if (picture) {
      update.picture = picture;
    }
    if (wallpaper) {
      update.wallpaper = wallpaper;
    }
    if (bio) {
      update.bio = bio;
    }

    const user = await UserModel.findByIdAndUpdate(author, update, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  })
);

router.patch(
  "/follow",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { otherUserId, myUserId } = req.body;

    await UserModel.findByIdAndUpdate(myUserId, {
      $push: { following: otherUserId },
    });
    const user = await UserModel.findByIdAndUpdate(
      otherUserId,
      {
        $push: { followers: myUserId },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  })
);

router.patch(
  "/unfollow",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { otherUserId, myUserId } = req.body;

    await UserModel.findByIdAndUpdate(myUserId, {
      $pull: { following: otherUserId },
    });

    const user = await UserModel.findByIdAndUpdate(
      otherUserId,
      {
        $pull: { followers: myUserId },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  })
);

// Delete a user by ID
router.delete(
  "/delete/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const idUser = req.params.id;

    const [listComment, listPosts] = await Promise.all([
      UserModel.findById(idUser, "comments").exec(),
      UserModel.findById(idUser, "posts").exec(),
    ]);

    const allIdPostComments = [...listComment.comments, ...listPosts.posts];

    const user = await UserModel.findByIdAndDelete(idUser);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Promise.all([
      UserModel.updateMany(
        { $or: [{ following: idUser }, { followers: idUser }] },
        { $pull: { following: idUser, followers: idUser } }
      ),
      UserModel.updateMany(
        { likes: { $in: allIdPostComments } },
        { $pullAll: { likes: allIdPostComments } }
      ),
      PostModel.updateMany(
        { isCommentOf: { $in: allIdPostComments } },
        { $pullAll: { isCommentOf: allIdPostComments } }
      ),
      PostModel.updateMany(
        { comments: { $in: allIdPostComments } },
        { $pullAll: { comments: allIdPostComments } }
      ),
      PostModel.updateMany({ likes: idUser }, { $pull: { likes: idUser } }),
      PostModel.deleteMany({ _id: { $in: allIdPostComments } }),
    ]);

    res.json(user);
  })
);

module.exports = router;
