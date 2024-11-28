import { Video } from "./video.model";
import VideoInput from "./VideoInput";
import { useState } from "react";

function VideoUpload() {
  const [video, setVideo] = useState<Video>({
    format:"mp4",
    resolution: "480",
    file: null
  })

  const handleVideoPropertyChange = (newVideo: Partial<Video>) => {
    setVideo((prevVideo) => (
      {
        ...prevVideo,
        ...newVideo
      }
    ))
  }

  async function startVideoConversion() {
    if (!video.file || !video.format || !video.resolution) {
      console.error("All fields (file, format, resolution) are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", video.file); 
    formData.append("format", video.format); 
    formData.append("resolution", video.resolution);

    try {
      const response = await fetch("http://localhost:3000/uploadVideo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Conversion started successfully:", data);
    } catch (error) {
      console.error("Error starting video conversion:", error);
    }
  }

  return (
    <>
      <div className="flex justify-evenly items-center w-1/2 h-64 m-auto p-4">
        <VideoInput
          video={video}
          onVideoPropertyChange={handleVideoPropertyChange}
        />
        <button onClick={startVideoConversion} className="rounded shadow-md bg-slate-900 h-fit items-center py-2 px-4 text-white">
          Convert
        </button>
      </div>
    </>
  );
}

export default VideoUpload;
