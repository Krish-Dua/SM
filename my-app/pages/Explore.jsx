import React, { useState, useEffect, use } from "react";
import { CircleXIcon ,ImageIcon,Video} from "lucide-react";

import { Link } from "react-router-dom";

const Explore = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [explorePosts, setExplorePosts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [users, setUsers] = useState([]);


  const fetchSearchedUsers = async (input) => {
    const response = await fetch(
      `http://localhost:3000/api/user/search/?username=${input}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (!data.success) {
      alert(data.message);
    } else {
      console.log(data);
      setUsers(data.data);
    }
  };

  const fetchExplorePosts = async () => {
    const response = await fetch("http://localhost:3000/api/post/exploreFeed", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!data.success) {
      alert(data.message);
    } else {
      console.log(data);
      setExplorePosts(data.data);
    }
  };

  useEffect(() => {
    console.log(explorePosts)
    fetchExplorePosts();
  }, []);

  useEffect(() => {
    if (search.length <= 0) {
      setUsers([]);
      setIsSearchActive(false);
      return;
    }

    setIsSearchActive(true);

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      console.log("Call API with:", debouncedSearch);
      fetchSearchedUsers(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <>
      <main className="max-w-5xl py-4 px-4 h-max mx-auto">
        <header className="flex justify-center">
          <div className="w-[80%] relative  mb-6">
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="bg-slate-900 border-0  text-lg w-full py-2 pl-2 pr-12 rounded-xl"
              type="text"
            />
            {isSearchActive && (
              <CircleXIcon
                onClick={() => {
                  setSearch("");
                  setUsers([]);
                }}
                className="absolute right-2 bottom-2"
              />
            )}
          </div>
        </header>

        {!isSearchActive ? (
          <section className="grid grid-cols-3 w-full gap-1 ">
            {explorePosts.map((post, index) => {
              if (post.mediaType === "video")
                return (
                  <div key={post._id} className="relative">
                    <video
                      className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center "
                      muted
                    >
                      <source src={post.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <Video className="absolute right-3 top-3 shadow-2xl" />
                  </div>
                );
              else
                return (
                  <div className="relative" key={post._id}>
                    <img
                      className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center "
                      src={post.media}
                      alt=""
                    />
                    <ImageIcon className="absolute right-3 top-3  shadow-black" />
                  </div>
                );
            })}
          </section>
        ) : (
          <section>
            {users.map((user, index) => {
              return (
                <Link
                  key={user.username}
                  to={`/${user.username}`}
                  className="mb-3 p-2 flex items-center justify-between last:mb-0  rounded-lg"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white text-black">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-300">{user.username}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
};

export default Explore;
