const express = require("express");
const cors = require("cors");
require("dotenv").config();
const postRoutes = require("./routes/postRouter");
const likeRoutes = require("./routes/likeRouter");
const commentRouter = require("./routes/commentRouter")
const leaderBoardRouter = require("./routes/leaderBoardRouter");
const rewardRouter = require("./routes/rewardRouter");

const app = express();
app.use(cors());
app.use(express.json());

// // Import Routes
// const postRoutes = require("./routes/postRoutes");
// const forumRoutes = require("./routes/forumRoutes");
// const rewardRoutes = require("./routes/rewardRoutes");

// app.use("/api/posts", postRoutes);
// app.use("/api/forums", forumRoutes);
// app.use("/api/rewards", rewardRoutes);

app.use("/posts", postRoutes);
app.use("/like-a-post", likeRoutes);
app.use("/comments", commentRouter);
app.use("/leaderboard", leaderBoardRouter);
app.use("/rewards",rewardRouter);
module.exports = app;
