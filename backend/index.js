import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI).then((connection) => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error(error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
app.use(cookieParser());



// Routes
app.use("/api/user",authRouter)
app.use("/api/post",postRouter)
app.get('/', (req, res) => res.send('❤️'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
