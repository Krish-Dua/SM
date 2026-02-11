import { useEffect, useState, useRef, useCallback } from "react";
import Reel from "../components/Reel";

const ReelPage = ({ arr }) => {
  const [reels, setReels] = useState(arr || []);
  const [loading, setLoading] = useState(false);
  const [loadedIds, setLoadedIds] = useState(arr ? arr.map((r) => r._id) : []);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const fetchReels = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try { 
      setLoading(true);
      const res = await fetch(`/api/post/reels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          exclude: reels.map((r) => r._id)  ,
          limit: 8,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.data.length === 0) {
          setHasMore(false); // ✅ No more reels
        } else {
          setReels((prev) => {
            // const existingIds = new Set(prev.map((r) => r._id));
            // const newReels = data.data.filter((r) => !existingIds.has(r._id));
            return [...prev, ...data.data];
          });

          setLoadedIds((prev) => [...prev, ...data.data.map((r) => r._id)]);
        }
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
    } finally {
      setLoading(false);
    }
  }, [loadedIds, hasMore, loading]);

  useEffect(() => {
    if (reels.length === 0) fetchReels();
  }, [fetchReels, reels.length]);


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
    return () => videos.forEach((video) => observer.unobserve(video));
  }, [reels]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const lastReel = document.querySelector(".last-reel");
     if (!lastReel || !hasMore ) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore && reels.length > 0) {
          fetchReels();
        }
      },
      { rootMargin: "100px" }
    );

    observerRef.current.observe(lastReel);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [fetchReels, reels, loading, hasMore]);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg dark:bg-black">
      {reels.map((reel, ind) => (
        <div key={reel._id} className={ind === reels.length - 1 ? "last-reel" : ""}>
          <Reel reel={reel} />
        </div>
      ))}

      {loading && (
        <div className="flex justify-center items-center py-4 text-white">
          Loading more reels...
        </div>
      )}

      {!hasMore && (
        <div className="text-center text-gray-400 py-4">No more reels</div>
      )}
    </div>
  );
};

export default ReelPage;
