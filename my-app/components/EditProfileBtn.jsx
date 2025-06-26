import React, { useRef,useEffect, useState } from "react";
import { Camera } from "lucide-react";
import useUserStore from "../store/user";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,  
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
 
const EditProfileBtn = ({ className }) => {
  const profileInputRef = useRef();
  const userStore = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [open, setOpen] = useState(false);
const [profilePic , setProfilePic]= useState("data:image/jpeg;base64,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")
  const [formData, setFormData] = useState({
    name:userStore.name,
    username:userStore.username ,
    email:userStore.email ,
    bio:userStore.bio ,
  });

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return;

    const type = selectedFile.type;

    if (
      !type.startsWith("image/") &&
      !type.startsWith("video/")
    ) {
      setError("Only image or video files are allowed.");   
         return;
    }
setProfilePic(URL.createObjectURL(selectedFile))
    setError(null);
  };



useEffect(() => {
    if (!open) {
      setFormData({
        name: userStore.name,
        username: userStore.username,
        email: userStore.email,
        bio: userStore.bio,
      });
      setProfilePic("data:image/jpeg;base64,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");
    }
  }, [open, userStore]);




  return (
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetTrigger asChild>
        <button className={`py-1  px-4 rounded-lg bg-gray-800 ${className} `}>
          Edit Profile
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[500px] px-4 overflow-y-auto dark:bg-gray-900 border-0 dark:text-white">
        <SheetHeader>
          <SheetTitle className="dark:text-white">Edit profile</SheetTitle>
          <SheetDescription className="dark:text-gray-300">
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <section className="flex  gap-4 flex-col">
          <div className="flex flex-col items-center">
            <div
              onClick={() => {
                profileInputRef.current.click();
              }}
              className="h-30 w-30  rounded-full relative overflow-hidden"
            >
              <img
                className="h-full w-full object-cover rounded-full"
                src={profilePic}
                alt=""
              />
              <div className="absolute top-23 w-full h-full  bg-black opacity-50 flex items-center justify-start flex-col">
                <Camera className="text-white " />
              </div>
              <input
                id="dropzone-file"
                required
                accept="image/*,video/*"
                onChange={(e)=>{
                handleFileInput(e)}}
                type="file"
                ref={profileInputRef}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="block w-full rounded-lg border border-gray-300 shadow-sm  sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-1  sm:py-2"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="block w-full rounded-lg border border-gray-300 shadow-sm sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="block w-full rounded-lg border border-gray-300 shadow-sm  sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                placeholder="Tell us about yourself"
                className="block w-full rounded-lg h-24  sm:h-34 overflow-y-auto resize-none border border-gray-300 shadow-sm  sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2"
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
              ></textarea>
            </div>
          </div>
        </section>
        <SheetFooter>
          {/* <SheetClose asChild>
            <button className="p-1 bg-black text-white dark:bg-white dark:text-black rounded-2xl">
              Save changes
            </button>
          </SheetClose> */}
           <button className="p-1 bg-black text-white dark:bg-white dark:text-black rounded-2xl">
              Save changes
            </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditProfileBtn;
