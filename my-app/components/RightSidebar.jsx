

 function RightSidebar() {
  const suggestedUsers = [
    { name: "Jane Smith", username: "@janesmith", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Alex Johnson", username: "@alexj", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Sam Wilson", username: "@samwilson", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  return (
    <aside className="hidden xl:flex w-80  p-4">
      <div className="w-full">
        <h2 className="text-md font-semibold mb-4">Suggested for you</h2>
        <div className="shadow-md rounded-lg p-3">
          {suggestedUsers.map((user) => (
            <div key={user.username} className="mb-3 p-2 flex items-center justify-between last:mb-0  rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white text-black">{user.name}</p>
                  <p className="text-xs text-gray-300">{user.username}</p>
                </div>
              </div>
              <button className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
export default RightSidebar;