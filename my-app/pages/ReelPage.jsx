import Reel from "../components/Reel";
import { useEffect, useState } from "react";

const ReelPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/feed?postType=reel`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
            console.log(data.data)
                      setReels(data.data);
        }
      } catch (error) {
        console.error("Error fetching reels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  // Autoplay logic
  useEffect(() => {
    const videos = document.querySelectorAll("video");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play();
          } else {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
    };
  }, [reels]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading reels...</div>;
  }

  return (
    <div className="h-screen overflow-y-auto snap-y mb-10  snap-mandatory bg-black">
      {reels.map((reel,ind) => (
 <Reel key={reel._id} reel={reel}/>
      ))}
    </div>
  );
};

export default ReelPage;
