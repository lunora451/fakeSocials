require("dotenv").config();
const cors = require("cors");
const express = require("express");
const routes = require("./routes");
const { models, connectDb } = require("./models");

const morgan = require("morgan");

const app = express();

// Third-Party Middleware
const corsOptions = {
  origin: process.env.FRONT_URL,
};
app.use(cors(corsOptions));

// app.use(cors()); //when dev
app.use(morgan("dev"));

// Built-In Middleware
app.use(express.json({ limit: "10mb" }));
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

connectDb().then(async () => {
  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
  );
});
