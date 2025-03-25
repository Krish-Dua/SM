import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { genTokenAndSetCookie } from "../services/genTokenAndSetCookie.js";

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
      "-password -followers -following"
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
  const { name, bio, avatar, username } = req.body;
  try {
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

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;
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
