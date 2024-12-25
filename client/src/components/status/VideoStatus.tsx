import { useState, useEffect } from "react";
import VideoHLSPLayer from "../live-stream/VideoHLSPlayer";
import { VideoStatusProps } from "./VideoStatusList";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function VideoStatus(props: VideoStatusProps) {
  const [showHLSPlayer, setShowHLSPlayer] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("#");

  useEffect(() => {
    fetch(`${BASE_URL}/getVideo/${props.uuid}`).then((res) =>
      res.json().then((body) => setDownloadUrl(body.url))
    ).catch(() => setDownloadUrl("#"));
  }, [props.uuid, props.status]);

  const handleClose = () => {
    setShowHLSPlayer(false);
  };

  let styles =
    "w-20 h-7 py-2 mx-2 text-sm font-semibold border-2 rounded-md flex items-center justify-center text-center";

  if (props.status === "Completed") {
    styles += "text-emerald-700 bg-emerald-200 border-emerald-500";
  } else if (props.status === "Incomplete") {
    styles += "text-orange-700 bg-orange-200 border-orange-500";
  } else {
    styles += "text-red-700 bg-red-200 border-red-500";
  }
  return (
    <>
      <div className="flex rounded-lg bg-slate-100 shadow my-2 mx-auto justify-between items-center p-2 h-12">
        <div className="rounded-full bg-slate-900 text-white font-semibold w-7 h-7 mx-2 flex items-center">
          <span className="mx-auto">{props.idx <= 99 ? props.idx : "99+"}</span>
        </div>
        <h5 className="text-md mx-2 font-semibold">
          {props.originalName.substring(0, 30) ?? "Unknown"}
        </h5>

        {props.conversionFormat === "m3u8" && (
          <button
            className="text-red-700 bg-red-200 border-2 border-red-500 rounded-md py-2 mx-2 w-12 h-7 font-semibold flex items-center justify-center text-sm"
            onClick={() => setShowHLSPlayer(true)}
            disabled={props.status === "Incomplete"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="w-4 h-4 m-2"
            >
              {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com 
        License - https://fontawesome.com/license/free 
        Copyright 2024 Fonticons, Inc. */}
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
          </button>
        )}

        {props.conversionFormat !== "m3u8" && (
          <a
            href={downloadUrl}
            className="text-red-700 bg-red-200 border-2 border-red-500 rounded-md py-2 mx-2 w-12 h-7 font-semibold flex items-center justify-center text-sm"
            onClick={(e) => downloadUrl === "#" && e.preventDefault()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 m-2">
              {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
              <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
            </svg>
          </a>
        )}

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
