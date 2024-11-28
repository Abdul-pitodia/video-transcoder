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

function VideoStatusList() {
  const [videoStatuses, setVideoStatuses] = useState<VideoStatusProps[]>([]);

  useEffect(() => {
    const fetchVideoStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/fetchStatus");
        console.log(response);
        
        if (response.ok) {
          const data: VideoStatusProps[] = await response.json();
          setVideoStatuses(data);
        } else {
          console.error("Failed to fetch video status", response.status);
        }
      } catch (err) {
        console.error("Error fetching video status", err);
      }
    };

    fetchVideoStatus();

    const intervalId = setInterval(() => fetchVideoStatus(), 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="min-w-fit max-w-96 mx-auto mt-4 p-2 rounded-lg">
        {
          videoStatuses.map((vs, idx) => (
            <VideoStatus {...vs} key={vs.uuid+1} idx={idx}/>
          ))
        }
      </div>
    </>
  );
}

export default VideoStatusList;
