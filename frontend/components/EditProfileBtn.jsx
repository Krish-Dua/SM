import React, { useRef, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const EditProfileBtn = ({ className,setLoggedInUser }) => {
  const profileInputRef = useRef();
const navigate = useNavigate();
  const userStore = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const [changedFields, setChangedFields] = useState({});
  const [formData, setFormData] = useState({
    name: userStore.name,
    username: userStore.username,
    email: userStore.email,
    bio: userStore.bio,
  });
  const [profilePic, setProfilePic] = useState(userStore.avatar);
  const [file, setFile] = useState(null);
 
  const USERNAME_REGEX = /^[a-zA-Z0-9._]*$/;
const USERNAME_MAX_LENGTH = 20;
const isUsernameValid = USERNAME_REGEX.test(formData.username);
    const MAX_BIO_LENGTH = 200;


  const handleSaveChanges = async () => {

    if (loading) return;
    if (!isUsernameValid) {
      return;
    }

const hasChanges =
    Object.values(changedFields).some(Boolean) || !!file;

  if (!hasChanges) {
    setloading(false);
    toast.info("apply changes first",{
      autoClose:1000,
      pauseOnHover:false
    })
    return;
  }


    setloading(true);

    const updatedData = new FormData();
    if (changedFields.name) {
      updatedData.append("name", formData.name);
    }
    if (changedFields.username) {
      updatedData.append("username", formData.username);
    }
    if (changedFields.bio) {
      updatedData.append("bio", formData.bio);
    }
    if (file) {
      updatedData.append("avatar", file);
    }



    const response = await fetch(`/api/user/update`, {
      method: "PATCH",
      body: updatedData,
      credentials: "include",
    });
const data = await response.json();
if (!data.success) {
  toast.error(data.message)
}
else{
  toast.success("profile updated successfully",{
    autoClose:2000,
    pauseOnHover:false,
    hideProgressBar:true
  })
  console.log(data)
  setUser(data.data);
  setChangedFields({});
  setFile(null);
  if(setLoggedInUser){
    setLoggedInUser(data.data)
  }
  if (changedFields.username) {
    navigate(`/${formData.username}`)
  }
}
  setloading(false);

  };

  const handleOnChange=(e)=> {
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.id]: e.target.value,
                  }));

                  setChangedFields((prev) => ({
                    ...prev,
                   [e.target.id]:e.target.value !== userStore[e.target.id] ? true : false,
                  }))

                }
  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const type = selectedFile.type;

    if (!type.startsWith("image/")) {
      setError("Only images are allowed.");
      return;
    }
    setProfilePic(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
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
      setProfilePic(userStore.avatar);
      setChangedFields({});
      setFile(null);
      setError(null);
      setloading(false);
    }
  }, [open, userStore]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
                src={profilePic || "/default-avatar.png"}
                alt=""
              />
              <div className="absolute top-23 w-full h-full  bg-black opacity-50 flex items-center justify-start flex-col">
                <Camera className="text-white " />
              </div>
              <input
                id="dropzone-file"
                required
                accept="image/*,video/*"
                onChange={(e) => {
                  handleFileInput(e);
                }}
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
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Username
              </label>
              <div className="relative" >
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="block w-full rounded-lg border border-gray-300 shadow-sm sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2"
                value={formData.username}
                maxLength={USERNAME_MAX_LENGTH}
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
              <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                {formData.username.length}/{USERNAME_MAX_LENGTH}
                </div>
              </div>
              {formData.username && !isUsernameValid && (
  <p className="text-red-600 mt-1 text-xs">Username can only contain letters, numbers, dot, and underscore.</p>
)}
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
                disabled={true}
                type="email"
                placeholder="Enter your email"
                className="block w-full rounded-lg border border-gray-300 shadow-sm  sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2"
                value={formData.email}
                
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Bio
              </label> <div className="relative" >
              <textarea
                id="bio"
                placeholder="Tell us about yourself"
                className="block w-full rounded-lg h-24  sm:h-34 overflow-y-auto resize-none border border-gray-300 shadow-sm  sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2"
                value={formData.bio}
              onChange={(e) => {
                  handleOnChange(e);
                }}
                maxLength={MAX_BIO_LENGTH}
              ></textarea>
              <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                {formData.bio.length}/{MAX_BIO_LENGTH}
                </div>
              </div>
            </div>
          </div>
        </section>
        <SheetFooter>
          <button
            onClick={handleSaveChanges}
            className="p-1 bg-black text-white dark:bg-white dark:text-black rounded-2xl"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditProfileBtn;
