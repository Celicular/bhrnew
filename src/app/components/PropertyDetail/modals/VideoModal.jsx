import { motion, AnimatePresence } from "motion/react";
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function VideoModal({ isOpen, onClose, videoUrl, videoFileName }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getFullVideoUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `https://bookholidayrental.com/${url}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    if (vol > 0) setIsMuted(false);
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current?.parentElement) {
      if (!isFullscreen) {
        videoRef.current.parentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-midnight-navy rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-midnight-navy to-midnight-navy/80 p-6 flex items-center justify-between border-b border-champagne-gold/20">
              <h2 className="text-2xl font-serif text-bone-white">
                {videoFileName || "Property Video"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-champagne-gold/20 rounded-lg transition-colors text-bone-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video Container */}
            <div className="bg-black aspect-video relative group">
              <video
                ref={videoRef}
                width="100%"
                height="100%"
                className="w-full h-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source src={getFullVideoUrl(videoUrl)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Controls - appears on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3"
              >
                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="flex-1 h-1 bg-[color:var(--gray-600)] rounded-lg appearance-none cursor-pointer accent-champagne-gold"
                  />
                  <span className="text-bone-white text-xs font-medium whitespace-nowrap">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                      onClick={handlePlayPause}
                      className="p-2 bg-champagne-gold/20 hover:bg-champagne-gold/40 rounded-lg transition-colors text-bone-white"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-bone-white" />
                      ) : (
                        <Play className="w-5 h-5 fill-bone-white" />
                      )}
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleMuteToggle}
                        className="p-2 bg-champagne-gold/20 hover:bg-champagne-gold/40 rounded-lg transition-colors text-bone-white"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-[color:var(--gray-600)] rounded-lg appearance-none cursor-pointer accent-champagne-gold"
                      />
                    </div>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={handleFullscreen}
                    className="p-2 bg-champagne-gold/20 hover:bg-champagne-gold/40 rounded-lg transition-colors text-bone-white"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
