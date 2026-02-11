import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import { toast } from "react-toastify";
const MAX_SIZE_MB = 50;
const MAX_DURATION_SECONDS = 60;


const PostModal = ({setOpen,postType}) => {
  const [preview, setpreview] = useState(null)
  const [caption, setCaption] = useState("");
const [file,setFile]= useState(null)
const [error,setError]= useState()
const [loading ,setLoading]= useState(false)


  const handleSubmit = async (e) => {
if(!file || !caption.trim()){
  setError("Please select a file and enter a caption.");
  return;
}
    setLoading(true);
    const formData = new FormData();
    formData.append("media", file); 
    formData.append("caption", caption);
    formData.append("mediaType", file.type.startsWith("video/") ? "video" : "image");
    formData.append("postType", postType); 
    const response = await fetch(`/api/post/create`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    if (!data.success) {
      setError(data.message || "Failed to create post.");
      
      return;
    }
    setCaption("");
    setFile(null);
    setpreview(null);
    toast.success(`${postType} Created`,{
      autoClose:2000,
      hideProgressBar:true,
      pauseOnHover:false
    })
    setError(null);
    setLoading(false);
    setOpen(false);
    

  }


  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const type = selectedFile.type;

    if (!type.startsWith("image/") && !type.startsWith("video/")) {
      setError("Only image or video files are allowed.");
      setFile(null);
      setpreview(null);
      return;
    }

    if (postType === "reel" && !type.startsWith("video/")) {
      setError("Only video files are allowed for reels.");
      setFile(null);
      setpreview(null);
      return;
    }

    if (selectedFile.size / 1024 / 1024 > MAX_SIZE_MB) {
      setError(`File size should not exceed ${MAX_SIZE_MB} MB.`);
      setFile(null);
      setpreview(null);
      return;
    }

    if (type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src); // Clean up the object URL

        if (video.duration > MAX_DURATION_SECONDS) {
          setError(`Video duration should not exceed ${MAX_DURATION_SECONDS} seconds.`);
          setFile(null);
          setpreview(null);
        } else {
          setError(null);
          setFile(selectedFile);
          setpreview(URL.createObjectURL(selectedFile));
        }
      }
      video.src = URL.createObjectURL(selectedFile);
    } else {
      // It's an image
      setError(null);
      setFile(selectedFile);
      setpreview(URL.createObjectURL(selectedFile));
    }
  };





  return (
    <main className="w-full flex flex-col gap-6 bg-white dark:bg-black text-black dark:text-white p-4 rounded-lg">
      {/* file input  */}
      <div className="flex items-center justify-center w-full">
{


preview?
<div className="w-full ">
<button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer transition" onClick={()=>{
  setpreview(null)
  setFile(null)
}}>Discard</button>
{file.type.startsWith("image/") ? (
  <img src={preview} className="h-70 object-cover w-full aspect-square" alt="preview" />
) : (
  postType==="post"?(
  <video className="h-70 object-cover w-full aspect-square" autoPlay muted controls controlsList="nodownload nofullscreen noremoteplayback" src={preview}></video>
  ):(
      <video
            src={preview}
            className="h-80 w-full aspect-9/16 rounded-lg"
            loop
            muted
            playsInline
          />
  )
)}
</div>
:
<label
htmlFor="dropzone-file"
className="flex flex-col items-center justify-center w-full h-70 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
<div className="flex flex-col items-center justify-center pt-5 pb-6">
  <svg
    className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 16"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
    />
  </svg>
  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
    <span className="font-semibold">Click to upload</span>
  </p>
  <p className="text-xs text-gray-500 dark:text-gray-400">
    {postType==="post"?"upload image or video only":"upload portrait video only"}
  </p>
</div>
<input id="dropzone-file" required accept="image/*,video/*" onChange={(e)=>{
  handleFileInput(e)
}} type="file"  className="hidden" />
</label>
}

        </div>

      {/* cap input  */}
      <div>
        <textarea
          name=""
          onChange={(e) => {
            setCaption(e.target.value);
          }}
          required
          value={caption}
          placeholder="Enter caption here"
          className="resize-none w-full h-20 p-1 overflow-y-auto outline-0 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded"
          id=""
        ></textarea>
      </div>

      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}



      {/* submit btn  */}
      <div className="flex justify-end">
        <Button type="submit" onClick={()=>{
handleSubmit()
        }} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
           {loading ? (
    <span className="flex items-center gap-2">
      <LoaderSpinner />
      Creating...
    </span>
  ) : (
    "Post"
  )}
          </Button>
      </div>




    </main>
  );
}


export default PostModal;
