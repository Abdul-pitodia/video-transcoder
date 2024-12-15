import Hls from "hls.js";
import { useRef, useEffect, useState } from "react";

interface Props {
    id: string;
}
const BASE_URL = import.meta.env.VITE_BASE_URL;


function VideoHLSPLayer(props : Props) {
  const [blobURL, setBlobURL] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/getPlaylistFile/${props.id}`)
      .then((res) => res.text())
      .then((modifiedM3U8Content) => {
        const blob = new Blob([modifiedM3U8Content], { type: 'application/x-mpegURL' });
        setBlobURL(URL.createObjectURL(blob));
      });
  }, []);

  useEffect(() => {
    // Check if Hls.js is supported and the blob URL is available
    if (Hls.isSupported() && blobURL && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(blobURL);  // Load the m3u8 playlist
      hls.attachMedia(videoRef.current);  // Attach the video element to HLS.js
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log("Manifest loaded, starting playback...");
        videoRef.current?.play();  // Start video playback once the manifest is loaded
      });

      hls.on(Hls.Events.ERROR, function (_event, data) {
        if (data.fatal) {
            console.error("Unknown error:", data);
        }
      });

      // Cleanup function to destroy HLS.js instance when the component unmounts
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [blobURL]);  // Re-run the effect when the blobURL changes

  return <video ref={videoRef} controls />;  // Render video element
}

export default VideoHLSPLayer;
