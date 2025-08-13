import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http';  
import { Server } from 'socket.io'; 
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';
import { v2 as cloudinary } from 'cloudinary';
import notificationRouter from './routes/notification.route.js';
import{initChatSocket} from './chat-service/index.js'
import chatRoute from './chat-service/routes/chat.route.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


const server = http.createServer(app);


export const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URLL],
    credentials: true,
  },
});

const onlineUsers = new Map();


io.on('connection', (socket) => {
  console.log(` User connected: ${socket.id}`);
  
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    onlineUsers.set(socket.id, userId);
    io.emit('updateOnlineUsers', Array.from(onlineUsers.values()));
    console.log(`User joined room: ${userId}`);
  });

  initChatSocket(socket,io)

  socket.on('disconnect', () => {
      const userId = onlineUsers.get(socket.id); 
    if (userId) {
      onlineUsers.delete(socket.id); 
      console.log(`User ${userId} disconnected`);
    }
    io.emit('updateOnlineUsers', Array.from(onlineUsers.values()));

  });
});


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URLL],
  credentials: true,
}));
app.use(cookieParser());


app.use("/api/user", authRouter);
app.use("/api/post", postRouter);
app.use("/api", notificationRouter);
app.use("/api/chat", chatRoute);




app.get('/', (req, res) => {
  res.send('Hello World!');
});


server.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}!`));
