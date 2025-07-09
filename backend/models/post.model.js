import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:'User',
required:true
    },
  postType: {
    type:String,
    enum:["post","reel"],
    required: true,
  },
  media:{
    type: String,
    required: true,
  },
mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type:[mongoose.Schema.Types.ObjectId] ,
    ref:"User",
    default:[]
  },  
},{timestamps:true});

export default mongoose.model("Post", postSchema);
