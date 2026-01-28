export function generateVideoThumbnail(videoUrl) {
  return new Promise((resolve) => {
    try {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.src = videoUrl;

      let seeked = false;
      let loaded = false;

      const cleanup = () => {
        video.pause();
        video.src = "";
      };

      const handleLoadedMetadata = () => {
        loaded = true;
        // Seek to 1 second
        video.currentTime = Math.min(1, video.duration * 0.3);
      };

      const handleSeeked = () => {
        if (!seeked && loaded) {
          seeked = true;
          try {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if (canvas.width > 0 && canvas.height > 0) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnail = canvas.toDataURL("image/jpeg", 0.85);
              resolve(thumbnail);
            } else {
              resolve(null);
            }
          } catch (err) {
            resolve(null);
          } finally {
            cleanup();
          }
        }
      };

      const handleError = () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("seeked", handleSeeked);
        video.removeEventListener("error", handleError);
        cleanup();
        resolve(null);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("seeked", handleSeeked);
      video.addEventListener("error", handleError);

      // Timeout fallback
      const timeout = setTimeout(() => {
        if (!seeked) {
          video.removeEventListener("loadedmetadata", handleLoadedMetadata);
          video.removeEventListener("seeked", handleSeeked);
          video.removeEventListener("error", handleError);
          cleanup();
          resolve(null);
        }
      }, 8000);

      video.load();

      return () => {
        clearTimeout(timeout);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("seeked", handleSeeked);
        video.removeEventListener("error", handleError);
        cleanup();
      };
    } catch (err) {
      resolve(null);
    }
  });
}
