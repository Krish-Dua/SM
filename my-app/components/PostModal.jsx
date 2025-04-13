import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const PostModal = () => {
  const [preview, setpreview] = useState(null)
  const [caption, setCaption] = useState("");
const [file,setFile]= useState(null)

  const handleFileInput =(e)=>{
    const file = e.target.files[0]
console.log(file)
setFile(file)
setpreview(URL.createObjectURL(file))
  }

  return (
    <main className="w-full flex flex-col gap-6">
      {/* file input  */}
      <div className="flex items-center justify-center w-full">
{
preview?

<div className="w-full ">
<button className="text-blue-800 cursor-pointer" onClick={()=>{
  console.log(preview)
  setpreview(null)

}}>Discard</button>
<img src={preview} className="h-70 object-cover w-full aspect-square" alt="" />
</div>

:
<label
htmlFor="dropzone-file"
className="flex flex-col items-center justify-center w-full h-70 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
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
    upload image only (jpg , png)
  </p>
</div>
<input id="dropzone-file" required accept="image/*" onChange={(e)=>{
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
          className="resize-none w-full h-20 p-1 overflow-y-auto outline-0 border-white border-1 bg-gray-800"
          id=""
        ></textarea>
      </div>

      {/* submit btn  */}
      <div className="flex justify-end">
        <Button type="submit" onClick={()=>{

        }} className="dark:bg-white dark:hover:bg-white dark:text-black">Post</Button>
      </div>




    </main>
  );
};

export default PostModal;
