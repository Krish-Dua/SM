import express from "express";
import {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  deleteComment,
  createComment,
  getUserSavedPosts,
  getComments,
  getFeed,
  getExploreFeed,
  getPostByUsername,
  getReels,
} from "../controllers/post.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import multer from "multer";
const route = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

route.post("/reels", authenticateUser, getReels);

route.post("/exploreFeed", authenticateUser, getExploreFeed);

route.post("/feed", authenticateUser, getFeed);

route.post("/create", authenticateUser, upload.single("media"), createPost);

route.post("/comment", authenticateUser, createComment);

route.patch("/lul/:id", authenticateUser, likeUnlikePost);

route.delete("/comment/:id", authenticateUser, deleteComment);

route.get("/comments/:id", authenticateUser, getComments);

route.get("/postedBy/:username", authenticateUser, getPostByUsername);

route.get("/saved", authenticateUser, getUserSavedPosts);

route.get("/:id", authenticateUser, getPost);

route.delete("/:id", authenticateUser, deletePost);

export default route;
