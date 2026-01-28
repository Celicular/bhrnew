import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { VideoModal } from "./modals/VideoModal";
import { generateVideoThumbnail } from "@/utils/videoThumbnail";

export function PropertyVideos({ videos }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnails, setThumbnails] = useState({});

  if (!videos || videos.length === 0) {
    return null;
  }

  // Filter out videos with missing URLs
  const validVideos = videos.filter((video) => video && video.url);

  if (validVideos.length === 0) {
    return null;
  }

  // Generate thumbnails
  useEffect(() => {
    const generateThumbnails = async () => {
      const getFullVideoUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return `https://bookholidayrental.com/${url}`;
      };

      const newThumbnails = {};
      for (let i = 0; i < validVideos.length; i++) {
        const video = validVideos[i];
        const fullUrl = getFullVideoUrl(video.url);
        const thumbnail = await generateVideoThumbnail(fullUrl);
        newThumbnails[i] = thumbnail;
      }
      setThumbnails(newThumbnails);
    };

    generateThumbnails();
  }, [validVideos]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const getFullVideoUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `https://bookholidayrental.com/${url}`;
  };

  const gridClass =
    validVideos.length === 1
      ? "grid-cols-1"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <>
      <motion.section
        id="videos"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="scroll-mt-24"
      >
        <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
          Property Videos
        </h2>

        <div className={`grid ${gridClass} gap-6 md:gap-8`}>
          {validVideos.map((video, index) => (
            <motion.button
              key={index}
              onClick={() => handleVideoClick(video)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left w-full"
            >
              {/* Thumbnail Container */}
              <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-midnight-navy via-midnight-navy/60 to-champagne-gold/20">
                {/* Thumbnail Image */}
                {thumbnails[index] && (
                  <img
                    src={thumbnails[index]}
                    alt={`Video ${index + 1} thumbnail`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Fallback gradient overlay if thumbnail not loaded */}
                {!thumbnails[index] && (
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-champagne-gold rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-champagne-gold rounded-full blur-3xl" />
                  </div>
                )}

                {/* Play Button */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="relative z-10 w-24 h-24 bg-champagne-gold rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-champagne-gold/50 transition-all duration-300"
                >
                  <Play className="w-10 h-10 text-midnight-navy fill-midnight-navy ml-1" />
                </motion.div>

                {/* Overlay on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/20 transition-opacity duration-300"
                />
              </div>

              {/* Video Counter */}
              <div className="absolute top-4 right-4 bg-midnight-navy/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-champagne-gold/30">
                <span className="text-champagne-gold font-medium text-sm">
                  Video {index + 1}/{validVideos.length}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoUrl={selectedVideo?.url}
        videoFileName={selectedVideo?.fileName}
      />
    </>
  );
}
