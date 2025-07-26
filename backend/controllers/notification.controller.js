import mongoose from "mongoose";
import Notification from "../models/notification.model.js"


export const getNotifications = async (req,res)=>{
try {
    const userId = req.user.userId
const notifications=await Notification.find({receiver:userId})
.populate("sender","username avatar")
.populate("post","media")
.sort({createdAt:-1})
.limit(30)


return res.json({success:true,data:notifications}

)
    
} catch (error) {
    console.log(error)
    return res.status(500).json({success:false,message:error.message})}
}

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};