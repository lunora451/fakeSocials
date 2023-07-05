require("dotenv").config();
const cors = require("cors");
const express = require("express");
const routes = require("./routes");
const { models, connectDb } = require("./models");

const morgan = require("morgan");

const app = express();

// Third-Party Middleware
// const corsOptions = {
//   origin: process.env.FRONT_URL,
// };
// app.use(cors(corsOptions));

app.use(cors()); //when dev
app.use(morgan("dev"));

// Built-In Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Custom Middleware

app.use((err, req, res, next) => {
  // Handle the error and send an appropriate response
  res.status(500).json({ error: err.post });
});

// * Routes * //
app.use("/users", routes.user);
app.use("/posts", routes.post);

// * Start * //

//delete database every sync
const eraseDatabaseOnSync = false;

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    //await Promise.all([models.User.deleteMany({}), models.Post.deleteMany({})]);
    // createUsersWithPosts();
  }
  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
  );
});

// const createUsersWithPosts = async () => {
//   const user1 = new models.User({
//     username: "rwieruch",
//   });
//   const user2 = new models.User({
//     username: "ddavids",
//   });

//   const post1 = new models.Post({
//     text: "Published the Road to learn React",
//     user: user1.id,
//   });
//   const post2 = new models.Post({
//     text: "Happy to release ...",
//     user: user2.id,
//   });

//   const post3 = new models.Post({
//     text: "Published a complete ...",
//     user: user2.id,
//   });

//   await post1.save();
//   await post2.save();
//   await post3.save();

//   await user1.save();
//   await user2.save();
// };
