import Dropdown from "./util/Dropdown";
import { Video } from "./video.model";

interface Props {
  video: Video;
  onVideoPropertyChange: (video: Partial<Video>) => void;
}

function VideoInput(props: Props) {

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    props.onVideoPropertyChange({
      file: uploadedFile,
    });
  };

  return (
    <>
      <div className="flex flex-col justify-center min-w-1/3 w-3/5 h-full items-start">
        <Dropdown
          dropDownValue={props.video.resolution}
          onDropDownSelect={(val: string) => {
            props.onVideoPropertyChange({
              resolution: val,
            });
          }}
          items={["480", "720"]}
          extraStyles="w-1/2"
          name="Choose target resolution"
        />
        <Dropdown
          dropDownValue={props.video.format}
          onDropDownSelect={(val: string) => {
            props.onVideoPropertyChange({
              format: val,
            });
          }}
          items={["mkv", "mp4", "webm"]}
          extraStyles="w-1/2"
          name="Choose target format"
        />
        <div className="flex gap-2 items-center w-full mr-2">
          <label
            htmlFor="dropzone-file"
            className="flex items-center justify-center w-1/2 mb-4 mr-2 h-fit rounded-lg cursor-pointer bg-indigo-700"
          >
            <div className="flex items-center justify-between p-2">
              <svg
                className="w-8 h-8 mr-2 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="text-sm text-white">
                <span className="font-semibold">Click to upload</span>
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          {props.video.file && (
            <span className="text-sm text-slate-600">{`${props.video.file.name.substring(
              0,
              15
            )}..`}</span>
          )}
        </div>
      </div>
    </>
  );
}

export default VideoInput;
