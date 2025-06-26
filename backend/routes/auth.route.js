import express from 'express';
import {signupUser,loginUser,logoutUser,getUser,updateUser,followUnfollowUser,getUserProfile, searchUser} from '../controllers/auth.controller.js'
import {authenticateUser} from '../middlewares/authenticateUser.js'
const route = express.Router()


route.post('/signup',signupUser);
route.post('/login',loginUser);
route.post('/logout',logoutUser);
route.post('/me',authenticateUser,getUser)
route.patch('/update',authenticateUser,updateUser)
route.patch('/fuf/:id',authenticateUser,followUnfollowUser)
route.get("/profile/:username",authenticateUser,getUserProfile)
route.get('/search/:username',authenticateUser,searchUser)



export default route;
