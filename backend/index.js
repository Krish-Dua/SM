import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'
import User from './models/user.model.js';
import Post from './models/post.model.js';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dummyUserIds = [
  "685ae5f5a1e556bb43a10997",
  "685d912b7ad8c2cadae6f6b3",
  "685d912b7ad8c2cadae6f6b4",
  "685d912b7ad8c2cadae6f6b5",
  "685d912b7ad8c2cadae6f6b6",
  "685d912b7ad8c2cadae6f6b7",
  "685d912b7ad8c2cadae6f6b8",
  "685d912b7ad8c2cadae6f6b9",
  "685d912b7ad8c2cadae6f6ba",
  "685d912b7ad8c2cadae6f6bb",
];

const mainUserId = "686955278a7f27267bf42376";

const createDummyPosts = async () => {
  // for (const userId of [...dummyUserIds, mainUserId]) {
  //   for (let i = 0; i < 3; i++) {
  //     await Post.create({
  //       postedBy: userId,
  //       postType: "post",
  //       media: `https://picsum.photos/seed/${userId}${i}150/150`,
  //       caption: `Test post ${i + 1} by user ${userId}`,
  //     });
  //   }
  // }
  for (let i = 3; i < 6; i++) {
      await Post.create({
        postedBy: mainUserId,
        postType: "reel",
        media: `https://picsum.photos/seed/${mainUserId}${i}150/150`,
        caption: `Test post ${i + 1} by user ${mainUserId}`,
      });
    }


  console.log("Dummy posts created 🎉");

};








mongoose.connect(process.env.MONGODB_URI).then(async(connection) => {
    console.log('Connected to MongoDB');
// createDummyPosts();
   
}).catch((error) => {
    console.error(error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin:[process.env.FRONTEND_URLL,process.env.FRONTEND_URL],
  credentials:true
}));
app.use(cookieParser());



// Routes
app.use("/api/user",authRouter)
app.use("/api/post",postRouter)
app.get('/', (req, res)=>{
    res.send('Hello World!');
});


app.listen(port, "0.0.0.0",() => console.log(`Example app listening on port ${port}!`));
