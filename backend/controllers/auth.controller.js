import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { genTokenAndSetCookie } from "../services/genTokenAndSetCookie.js";
import mongoose from "mongoose";
import {v2 as cloudinary} from 'cloudinary';


export const signupUser = async (req, res) => {
  const { email, password, username, name } = req.body;
  try {
    if (!email || !password || !username || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUserWithemail = await User.findOne({ email });

    if (existingUserWithemail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const existingUserWithUsername = await User.findOne({ username });

    if (existingUserWithUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
    });

    genTokenAndSetCookie(res, user);
    res.json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error at signup" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    genTokenAndSetCookie(res, user);
    res.json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error at login" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "User logged out successfully" });
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password"
    );
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error at getting user" });
  }
};

export const updateUser = async (req, res) => {
  const { name, bio, username } = req.body;

  try {
  if (!name && !bio && !req.file && !username) {
    return res
      .status(400)
      .json({ success: false, message: "No fields to update" });
  }
    if(username){
      const existingUserWithUsername = await User.findOne({ username });
      if(existingUserWithUsername) {
        return res
         .status(400)
         .json({ success: false, message: "Username not available" });
      } 
      
      }
    let user = await User.findById(req.user.userId).select(
      "-password -followers -following"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }


    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "econn/avatars",
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          stream.end(req.file.buffer); // Push buffer into stream
        });
      };

      const result = await streamUpload();
      if (user.avatar) {
        let publicId = user.avatar.split("upload/")[1].split("/").slice(1).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
        
      }
      user.avatar = result.secure_url;
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.username = username || user.username;

    user = await user.save();
    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error at updating user" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const targetUserId = req.params.id;

    if (userId === targetUserId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.following.includes(targetUserId)) {
      await User.findByIdAndUpdate(userId, {
        $pull: { following: targetUserId },
      });
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: userId },
      });

      return res
        .status(200)
        .json({ success: true, message: "Unfollowed user" });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { following: targetUserId },
      });
      await User.findByIdAndUpdate(targetUserId, {
        $push: { followers: userId },
      });

      return res.status(200).json({ success: true, message: "Followed user" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const getUserProfile = async(req,res) => {
 try {
  const {username}= req.params
  const user = await User.findOne({username}).select("-password");
  if(!user) {
   return res
    .status(404)
    .json({ success: false, message: "User not found" });
  }
  res.json({ success: true, data: user });
 } catch(error) {
   console.error(error);
   return res
    .status(500)
    .json({ success: false, message: "Internal server error", error });
  
 }
}

export const searchUser = async(req,res) => {
  try {
    const {username} = req.query;
    const users = await User.find({
      username: { $regex: username, $options: "i" }
    }).select("avatar name username").limit(10);
    console.log(users)
    
    if(users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }
    res.json({ success: true, data: users });
  } catch(error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}

export const getSuggestions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const size = req.query.size ? parseInt(req.query.size) : 6;
    const user = await User.findById(userId).select("following");
    const excludeIds = [...user.following,new mongoose.Types.ObjectId(userId)];

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }


   const suggestions = await User.aggregate([
      { $match: { _id: { $nin: excludeIds },
} },
      { $sample: { size} },
    ]);

    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error at getting suggestions" });
  }
};  

export const saveUnsavePost= async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;
console.log(postId)
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.saved.includes(postId)) {
      user.saved = user.saved.filter(id => id.toString() !== postId);
      await user.save();
      return res.status(200).json({ success: true, message: "unsaved" });
    } else {
      user.saved.unshift(postId);
      await user.save();
      return res.status(200).json({ success: true, message: "saved" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error at saving post" });
  }
};