import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,

  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusSquareIcon } from "lucide-react";
import { Link } from "react-router-dom";
import PostModal from "./PostModal";
import ReelModal from "./ReelModal";


const CreateBtn = () => {

  const [postModalOpen, setpostModalOpen] = React.useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center cursor-pointer  gap-5 px-3 py-2">
          <PlusSquareIcon
            size={26}
            className="text-gray-700 dark:text-gray-400"
          />
          <span className="hidden lg:inline text-xl font-bold">Create</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="dark:bg-gray-900 w-fit  dark:text-white border-0 flex flex-col gap-2">



        {/* <Link to="/create?type=post">
          <p className="mb-2 px-6 py-1 hover:bg-gray-700 rounded-xl">Post</p>
        </Link> */}
          <Dialog open={postModalOpen} onOpenChange={setpostModalOpen}  >
      <DialogTrigger asChild>
        <button className="mb-2 px-6 py-1 hover:bg-gray-700 rounded-xl">Post</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]  dark:bg-black border-0  text-white">
        <DialogTitle>
 Create Post 
        </DialogTitle>
         <PostModal setOpen={setpostModalOpen} />
      </DialogContent>
    </Dialog>


        {/* <Link to="/create?type=reel">
          <p className=" px-6 py-1  hover:bg-gray-700 rounded-xl">Reel</p>
        </Link> */}
   <Dialog>
      <DialogTrigger asChild>
        <button className="mb-2 px-6 py-1 hover:bg-gray-700 rounded-xl">Reel</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]  dark:bg-black border-0  text-white">
        <DialogTitle>
 Create Reel 
        </DialogTitle>
         <ReelModal/>
      </DialogContent>
    </Dialog>



      </PopoverContent>
    </Popover>
  );
};

export default CreateBtn;
