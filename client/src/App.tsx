import { useState } from "react";
import "./App.css";
import VideoUpload from "./components/VideoUpload";
import VideoStatusList from "./components/status/VideoStatusList";

function App() {
  const [key, setKey] = useState<number>(0);

  return (
    <>
      <div className="container mx-auto p-4 text-center">
        <p className="font-semibold text-2xl mb-4">Upload any video file to convert to other format or Livestream</p>
        <VideoUpload forceUpdate={setKey}/>
        <VideoStatusList key={key}/>
      </div>
    </>
  );
}

export default App;
