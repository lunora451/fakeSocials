const mongoose = require("mongoose");

const User = require("./user.models");
const Post = require("./post.models");

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};

const models = { User, Post };

module.exports = {
  connectDb,
  models,
};
