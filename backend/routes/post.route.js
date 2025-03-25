import express from 'express';
import {createPost,getPost,deletePost,likeUnlikePost,deleteComment,createComment,getComments} from '../controllers/post.controller.js'
import {authenticateUser} from '../middlewares/authenticateUser.js'
const route = express.Router()

route.post('/create',authenticateUser,createPost)
route.get('/:id',getPost)
route.delete('/:id',deletePost)
route.patch('/lul/:id',authenticateUser,likeUnlikePost)
route.delete('/comment/:id',deleteComment)
route.post('/comment',authenticateUser,createComment)
route.get('/comments/:id',authenticateUser,getComments)



export default route