import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import {v2 as cloudinary} from 'cloudinary';
import {io} from "../index.js"

export const createPost = async (req, res) => {
  const postedBy = req.user.userId;
  const { mediaType, caption ,postType} = req.body;
  let media = req.file
  
  try {
    if (!mediaType || !media || !caption || !postType) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }


     if (req.file) {
          const streamUpload = () => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: "econn/media",
                  resource_type: mediaType,
                },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result);
                }
              );
    
              stream.end(req.file.buffer); 
            });
          };
    
          const result = await streamUpload();
        
          media = result.secure_url;
        }
    




    const newPost = await Post.create({
      postedBy,
      postType,
      mediaType,
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
    const post = await Post.findById(req.params.id).populate("postedBy");
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
  const userId = req.user.userId;
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res
        .status(404).populate("postedBy", "username")
        .json({ success: false, message: "post not found" });
    }
    if(!post.postedBy._id === userId) {
      return res.status(403).json({ success: false, message: "not authorized to delete this post" });
    }
    await Comment.deleteMany({ toPost: id });

    if (post.media) {
        let publicId = post.media.split("upload/")[1].split("/").slice(1).join("/").split(".")[0];
     await cloudinary.uploader.destroy(publicId);
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
    const post = await Post.findById(postId).populate("postedBy", "_id");
    if (!post) {
      return res.status(400).json({ success: true, message: "post not found" });
    }
const postedBy=post.postedBy._id
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
      return res.status(200).json({ success: true, message: "unliked" });
    } else {
      
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId },
      });
       res.status(200).json({ success: true, message: "liked" });

          const notification = await Notification.create({
        sender:userId,
        receiver:postedBy,
        post:postId,
        type:"like",
      })
const populatedNotification=await notification.populate([{
  path:"sender",select:"username avatar"
},{
  path:"post",select:"media"
}])
io.to(postedBy.toString()).emit("newNotification",populatedNotification)
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
    const post = await Post.findById(toPost);
    if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
    }
    const postedBy = post.postedBy._id;

    let comment = await Comment.create({
      commentedBy,
      toPost,
      content,
    });
    comment = await comment.populate("commentedBy", "username avatar");
    res.json({ success: true, data: comment });

    const notification = await Notification.create({
        sender:commentedBy,
        receiver:postedBy,
        post:toPost,
        type:"comment",
      })
const populatedNotification=await notification.populate([{
  path:"sender",select:"username avatar"
},{
  path:"post",select:"media"
}])
io.to(postedBy.toString()).emit("newNotification",populatedNotification)

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
    const countOnly = req.query.countOnly === "true";
    if (countOnly) {
      const count = await Comment.countDocuments({ toPost: postId });
      return res.json({ success: true, data:count  });
    }
    const comments = await Comment.find({ toPost: postId }).populate("commentedBy", "username avatar");
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
    const { exclude = [], limit=5}= req.body;

    const excludeIds = exclude.map((id) => new mongoose.Types.ObjectId(id));
    const posts = await Post.aggregate([
      {
        $match: {
          postType: "post", 
          _id: { $nin: excludeIds }, 
          postedBy:{$ne:new mongoose.Types.ObjectId(req.user.userId)},
        },
      },
      { $sample: { size: limit } }, 

    ]);
    await Post.populate(posts, { path: "postedBy", select: "username avatar name" });

    return res.json({ success: true, data:posts });
  } catch (error) {
    console.error("Error fetching reels:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getExploreFeed = async (req, res) => {
  const { exclude = [] ,size=24,postType} = req.body; 

  try {
    const excludeIds = exclude.map((id) => new mongoose.Types.ObjectId(id));
let matchStage= {
  postedBy: { $ne: new mongoose.Types.ObjectId(req.user.userId) },
  _id: { $nin: excludeIds },
};
if(postType) {
  matchStage.postType = postType;
}
    const posts = await Post.aggregate([
      {
        $match:matchStage
      },
      { $sample: { size } }, 
    ]);

    
    await Post.populate(posts
      , {
      path: "postedBy",
      // select: "username avatar name",
    }
  );

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error at getExploreFeed" });
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

    const posts = await Post.find(query).populate("postedBy")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts,user});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at get post by username" });
  }
}

export const getUserSavedPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .populate({
        path: "saved",
         populate: {
          path: "postedBy", 
          select: "username name avatar", 
        },
      })
      .select("saved"); 

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user.saved }); 
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "server error at get user saved posts" });
  }
};


export const getReels =async (req, res) => {
  try {
    const { exclude = [], limit=5}= req.body;

    const excludeIds = exclude.map((id) => new mongoose.Types.ObjectId(id));
    const reels = await Post.aggregate([
      {
        $match: {
          postType: "reel", 
          _id: { $nin: excludeIds }, 
          postedBy:{$ne:new mongoose.Types.ObjectId(req.user.userId)},
        },
      },
      { $sample: { size: limit } }, 
    ]);
    await Post.populate(reels, { path: "postedBy", select: "username avatar name" });

    return res.json({ success: true, data:reels });
  } catch (error) {
    console.error("Error fetching reels:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
