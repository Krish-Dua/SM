import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:'user',
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
