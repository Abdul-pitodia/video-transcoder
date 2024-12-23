import { Video } from "./video.model";
import VideoInput from "./VideoInput";
import { useState } from "react";

interface Props {
  forceUpdate: (...args: any[]) => void;
}
const BASE_URL = import.meta.env.VITE_BASE_URL;

function VideoUpload(props: Props) {
  const [video, setVideo] = useState<Video>({
    format: "mp4",
    resolution: "480",
    file: null,
  });

  const [error, setError] = useState<string|null>(null);

  const handleVideoPropertyChange = (newVideo: Partial<Video>) => {
    setVideo((prevVideo) => ({
      ...prevVideo,
      ...newVideo,
    }));
  };

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
      const response = await fetch(`${BASE_URL}/uploadVideo`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errMsg = await response.json()
        setError(errMsg?.message);
        console.log(errMsg);
        setVideo(oldVideo => ({
          ...oldVideo,
          file: null
        }))
        
        setTimeout(() => setError(null), 2000)
        throw new Error(`Error: ${response.statusText}`);
      }

      props.forceUpdate();
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
        <button
          onClick={startVideoConversion}
          className="rounded shadow-md bg-slate-900 h-fit items-center py-2 px-4 text-white"
          disabled={
            video.file === null || video.file === undefined || error !== null
          }
        >
          Convert
        </button>
        {error && <p className="text-center rounded-md text-red-500">There was an error when doing the conversion</p>}
      </div>
    </>
  );
}

export default VideoUpload;
