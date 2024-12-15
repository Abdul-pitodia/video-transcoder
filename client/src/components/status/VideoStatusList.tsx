import { useState, useEffect } from "react";
import VideoStatus from "./VideoStatus";

export interface VideoStatusProps {
  idx: number;
  uuid: string;
  status: string;
  originalName: string;
  conversionFormat: string;
  conversionResolution: string;
}
const BASE_URL = import.meta.env.VITE_BASE_URL;


function VideoStatusList() {
  const [videoStatuses, setVideoStatuses] = useState<VideoStatusProps[]>([]);

  useEffect(() => {
    const fetchVideoStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/fetchStatus`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        
        if (response.ok) {
          const data: VideoStatusProps[] = await response.json();
          setVideoStatuses(data);
        } else {
          console.error("Failed to fetch video status", response.status);
          throw new Error("API Polling failed");
        }
      } catch (err) {
        console.error("Error fetching video status", err);
        throw new Error("API Polling failed");
      }
    };

    fetchVideoStatus();

    const intervalId = setInterval(() => fetchVideoStatus().catch(() => intervalId && clearInterval(intervalId)), 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="min-w-fit max-w-96 mx-auto mt-4 p-2 rounded-lg">
        {
          videoStatuses.map((vs, idx) => (
            <VideoStatus {...vs} key={vs.uuid} idx={idx+1}/>
          ))
        }
      </div>
    </>
  );
}

export default VideoStatusList;
