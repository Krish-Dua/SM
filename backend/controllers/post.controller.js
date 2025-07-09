import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  const postedBy = req.user.userId;
  const { postType, media, caption } = req.body;
  try {
    if (!postType || !media || !caption) {
      return res
        .status(400)
        .json({ success: false, message: "all fields required" });
    }

    const newPost = await Post.create({
      postedBy,
      postType,
      media,
      caption,
    });
    res.json({ success: true, data: newPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at create post" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "post not found" });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at get post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "post not found" });
    }
    res.json({ success: true, message: "post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: true, message: "server error at delete post" });
  }
};

export const likeUnlikePost = async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ success: true, message: "post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      //unlike
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
      return res.status(200).json({ success: true, message: "post unliked" });
    } else {
      //like
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId },
      });
      return res.status(200).json({ success: true, message: "post liked" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at likeUnlikePost" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { toPost, content } = req.body;
    const commentedBy = req.user.userId;
    const comment = await Comment.create({
      commentedBy,
      toPost,
      content,
    });

    res.json({ success: true, data: comment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "comment not found" });
    }
    res.json({ success: true, message: "comment deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at delete comment" });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ toPost: postId });
    res.json({ success: true, data: comments });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at get comments" });
  }
};

export const getFeed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const posts = await Post.find({})
      .limit(10)
      .populate("postedBy", "username profilePicture");
    res.json({ success: true, data: posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at get feed" });
  }
};
export const getExploreFeed = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
         postedBy:{$ne:new mongoose.Types.ObjectId(req.user.userId)},
      },
      },
      { $sample: { size: 21 } },

    ]);
    res.json({ success: true, data: posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at get explore feed" });
  }
};

export const getPostByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne ({ username }).select("_id");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const query = { postedBy: user._id };
    if (req.query.type) {
      query.postType = req.query.type;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts,user});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at get post by username" });
  }
}