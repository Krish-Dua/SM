import express from 'express';
import {createPost,getPost,deletePost,likeUnlikePost,deleteComment,createComment,getUserSavedPosts,getComments, getFeed, getExploreFeed, getPostByUsername} from '../controllers/post.controller.js'
import {authenticateUser} from '../middlewares/authenticateUser.js'
const route = express.Router()



route.get('/exploreFeed',authenticateUser,getExploreFeed)
route.get('/feed',authenticateUser,getFeed)
route.post('/create',authenticateUser,createPost)
route.post('/comment',authenticateUser,createComment)
route.patch('/lul/:id',authenticateUser,likeUnlikePost)
route.delete('/comment/:id',deleteComment)
route.get('/comments/:id',authenticateUser,getComments)
route.get('/postedBy/:username',authenticateUser,getPostByUsername)
route.get('/saved',authenticateUser,getUserSavedPosts)
route.get('/:id',getPost)
route.delete('/:id',deletePost)




export default route