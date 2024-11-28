import "./App.css";
import VideoUpload from "./components/VideoUpload";
import VideoStatusList from "./components/status/VideoStatusList";

function App() {
  return (
    <>
      <div className="container mx-auto p-4">
        <VideoUpload/>
        <VideoStatusList/>
      </div>
    </>
  );
}

export default App;
