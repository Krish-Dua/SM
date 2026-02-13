import React, { useState } from "react";
import { useChatStore } from "../store/chat";
import "../src/App.css";
import useUserStore from "../store/user";
import { PenBoxIcon } from "lucide-react";
import NewChatDialog from "./NewChatDialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ConversationList = () => {
  const {
    conversations,
    fetchConversations,
    setActiveConversation,
    activeConversation,
    typingUsers,
    onlineUsers,
  } = useChatStore();
  const user = useUserStore((state) => state.user);
  const [dialogOpen, setDialogOpen] = useState(false);

  React.useEffect(() => {
    if (conversations.length === 0) {
      fetchConversations();
    }
  }, []);

  return (
    <main className="w-full h-full flex flex-col gap-6 overflow-auto custom-scrollbar bg-white dark:bg-black text-black dark:text-white">
      <header className="flex p-5 border-b border-gray-300 dark:border-gray-700 items-center justify-between">
        <p className="text-xl text-center font-bold text-black dark:text-white">{user.username}</p>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <PenBoxIcon />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[60%] custom-scrollbar overflow-auto  dark:bg-black border-0 text-black  dark:text-white">
            <DialogTitle className={"text-center text-black dark:text-white"}>New message</DialogTitle>
            <NewChatDialog setOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </header>

      <p className="px-4 font-bold text-xl text-black dark:text-white">Messages :-</p>
      <div className="flex flex-col mb-15 gap-2">
        {conversations.map((convo) => (
          <div
            onClick={() => {
              setActiveConversation(convo);
            }}
            key={convo.receiver.username}
            className={`${
              activeConversation?.receiver._id === convo.receiver._id
                ? "bg-gray-200 dark:bg-slate-900"
                : "hover:bg-gray-100 dark:hover:bg-gray-900"
            } px-4 py-2 flex items-center justify-between transition rounded-lg cursor-pointer`}
          >
            <div className="flex items-center gap-6">
              <div className="relative h-15 w-15">
                <div className="h-15 w-15 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={convo.receiver.avatar || "/default-avatar.png"}
                    alt={convo.receiver.name}
                    className="h-full w-full object-center"
                  />
                </div>
                {onlineUsers.includes(convo.receiver._id) && (
                  <div className="h-4 w-4 bg-green-600 absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900"></div>
                )}
              </div>

              <div>
                <p className="text-md font-medium text-black dark:text-white">
                  {convo.receiver.username}
                </p>
                {typingUsers.includes(convo.receiver._id) ? (
                  <p className="text-sm text-blue-600 dark:text-blue-400">Typing...</p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {convo.lastMsg ? convo.lastMsg : convo.receiver.name}
                  </p>
                )}
              </div>
            </div>
            {/* unread badge */}
            {convo.unreadCount > 0 && (
              <div className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {convo.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};
export default ConversationList;
