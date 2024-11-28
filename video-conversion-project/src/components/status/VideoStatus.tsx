import { VideoStatusProps } from "./VideoStatusList";

function VideoStatus(props: VideoStatusProps) {
  return (
    <>
      <div className="flex rounded-lg bg-slate-100 shadow my-2 mx-auto justify-between items-center p-2 h-12">
        <div className="rounded-full bg-slate-900 text-white font-semibold w-7 h-7 mx-2 flex items-center">
          <span className="mx-auto">{props.idx <= 99 ? props.idx: "99+"}</span>
        </div>
        <h5 className="text-md mx-2 font-semibold">
          {props.originalName.substring(0,30) ?? "Unknown"}
        </h5>
        <a className="text-red-700 bg-red-200 border-2 border-red-500 rounded-md py-2 mx-2 w-20 h-7 font-semibold flex items-center justify-center text-sm">
          {props.conversionResolution}
        </a>
        <div className="w-20 h-7 py-2 mx-2 text-sm text-emerald-700 font-semibold bg-emerald-200 border-2 border-emerald-500 rounded-md flex items-center justify-center">
          <p className="text-xs">{props.status}</p>
        </div>
      </div>
    </>
  );
}

export default VideoStatus;
