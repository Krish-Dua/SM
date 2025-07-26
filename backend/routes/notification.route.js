import express from 'express';
import {authenticateUser} from '../middlewares/authenticateUser.js'
import {getNotifications,markAllNotificationsRead} from "../controllers/notification.controller.js"
const route=express.Router()


route.get("/notifications",authenticateUser,getNotifications)
route.patch("/notification/mark-all-read",authenticateUser,markAllNotificationsRead)



export default route;