import React from 'react'
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
const EditProfileBtn = ({className}) => {
  return (
    <Sheet>
    <SheetTrigger asChild>
<button className={`py-1  px-4 rounded-lg bg-gray-800 ${className} `} >Edit Profile</button>
    </SheetTrigger>
    <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto dark:bg-gray-900 border-0 dark:text-white" >
      <SheetHeader>
        <SheetTitle className="dark:text-white">Edit profile</SheetTitle>
        <SheetDescription className="dark:text-gray-300">
          Make changes to your profile here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="name" className="text-right">
            Name
          </label>
          <input id="name" value="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="username" className="text-right">
            Username
          </label>
          <input id="username" value="@peduarte" className="col-span-3" />
        </div>
      </div>
      <SheetFooter >
        <SheetClose asChild>
          <button className='p-1 bg-black text-white dark:bg-white dark:text-black rounded-2xl' >Save changes</button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
  )
}

export default EditProfileBtn
