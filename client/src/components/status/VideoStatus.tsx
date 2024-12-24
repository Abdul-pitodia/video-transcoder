import { useState, useEffect } from "react";
import VideoHLSPLayer from "../live-stream/VideoHLSPlayer";
import { VideoStatusProps } from "./VideoStatusList";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function VideoStatus(props: VideoStatusProps) {
  const [showHLSPlayer, setShowHLSPlayer] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("#");
  
  useEffect(() => {
    fetch(`${BASE_URL}/getVideo/${props.uuid}`).then(res => res.json().then(body => setDownloadUrl(body.url)))
  }, [props.uuid])

  const handleClose = () => {
    setShowHLSPlayer(false);
  };
  
  let styles = 'w-20 h-7 py-2 mx-2 text-sm font-semibold border-2 rounded-md flex items-center justify-center text-center'

  if (props.status === 'Completed'){
    styles += 'text-emerald-700 bg-emerald-200 border-emerald-500'
  }
  else if (props.status === 'Incomplete'){
    styles += 'text-orange-700 bg-orange-200 border-orange-500'
  }
  else {
    styles += 'text-red-700 bg-red-200 border-red-500'
  }
  return (
    <>
      <div className="flex rounded-lg bg-slate-100 shadow my-2 mx-auto justify-between items-center p-2 h-12">
        <div className="rounded-full bg-slate-900 text-white font-semibold w-7 h-7 mx-2 flex items-center">
          <span className="mx-auto">{props.idx <= 99 ? props.idx: "99+"}</span>
        </div>
        <h5 className="text-md mx-2 font-semibold">
          {props.originalName.substring(0,30) ?? "Unknown"}
        </h5>

        {props.conversionFormat === 'm3u8' && <button className="text-red-700 bg-red-200 border-2 border-red-500 rounded-md py-2 mx-2 w-20 h-7 font-semibold flex items-center justify-center text-sm" onClick={() => setShowHLSPlayer(true)} disabled={props.status === 'Incomplete'}>
          {props.conversionResolution}
        </button>}

        {props.conversionFormat !== 'm3u8' && 
        <a href={downloadUrl} className="text-red-700 bg-red-200 border-2 border-red-500 rounded-md py-2 mx-2 w-20 h-7 font-semibold flex items-center justify-center text-sm" onClick={(e) => downloadUrl === "#" && e.preventDefault()}>
          {props.conversionResolution}
        </a>
        }

        {showHLSPlayer && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          {/* Modal content */}
          <div className="bg-white p-6 rounded-lg w-4/5 max-w-3xl">
            <button
              className="absolute top-2 right-2 text-2xl bg-white"
              onClick={handleClose}
            >
              ✖
            </button>
            {/* Video HLS player */}
            <VideoHLSPLayer id={props.uuid} />
          </div>
        </div>
      )}

        <div className={styles}>
          <p className="text-xs">{props.status}</p>
        </div>
      </div>
    </>
  );
}

export default VideoStatus;
