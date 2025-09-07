import express from 'express';
import {signupUser,loginUser,logoutUser,getUser,updateUser,followUnfollowUser,getUserProfile,getFollwersOrFollwingList, searchUser, getSuggestions, saveUnsavePost} from '../controllers/auth.controller.js'
import {authenticateUser} from '../middlewares/authenticateUser.js'
import multer from 'multer';
import {loginLimiter} from "../services/rateLimiter.js"
const upload = multer({
    storage:multer.memoryStorage()
})



const route = express.Router()

route.post('/signup',signupUser);
route.get('/suggestions',authenticateUser,getSuggestions); 
route.post('/login',loginLimiter,loginUser);
route.post('/logout',logoutUser);
route.post('/me',authenticateUser,getUser)
route.get('/followersOrFollowing',authenticateUser,getFollwersOrFollwingList)
route.patch('/update',authenticateUser,upload.single("avatar"),updateUser)
route.patch('/fuf/:id',authenticateUser,followUnfollowUser)
route.get("/profile/:username",authenticateUser,getUserProfile)
route.get('/search',authenticateUser,searchUser)
route.patch('/save/:postId',authenticateUser,saveUnsavePost)


export default route;
