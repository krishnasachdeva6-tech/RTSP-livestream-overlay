import { useState, useEffect, Component } from 'react'
import axios from 'axios'
import './App.css'
import VideoPlayer from './components/VideoPlayer'
import Overlay from './components/Overlay'

// Use environment variable if available (Production), else localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/overlays';

// Simple Error Boundary to catch crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#ffe6e6', color: '#cc0000', border: '1px solid red' }}>
          <h3>Something went wrong.</h3>
          <p>{this.state.error && this.state.error.toString()}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [overlays, setOverlays] = useState([]);
  const [rtspUrl, setRtspUrl] = useState("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("text");

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    try {
      const res = await axios.get(API_URL);
      setOverlays(res.data);
    } catch (err) {
      console.error("Error fetching overlays:", err);
    }
  };

  const createOverlay = async () => {
    if (!newContent) return;
    try {
      const payload = {
        type: newType,
        content: newContent,
        x: 50,
        y: 50,
        width: 200,
        height: 100
      };

      const res = await axios.post(API_URL, payload);
      setOverlays([...overlays, res.data]);
      setNewContent("");
    } catch (err) {
      console.error("Error creating overlay:", err);
      alert("Failed to create overlay. Check console.");
    }
  };

  const updateOverlay = async (id, data) => {
    try {
      setOverlays(prev => prev.map(o => o._id === id ? { ...o, ...data } : o));
      await axios.put(`${API_URL}/${id}`, data);
    } catch (err) {
      console.error("Error updating overlay:", err);
    }
  };

  const deleteOverlay = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setOverlays(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      console.error("Error deleting overlay:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>RTSP Livestream Overlay App</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="RTSP/Video URL"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          style={{ width: '300px' }}
        />
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min="0" max="1" step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>

      <div className="video-container">
        <VideoPlayer url={rtspUrl} isPlaying={isPlaying} volume={volume} />

        {/* Render Overlays Protected by Error Boundary */}
        {overlays.map(overlay => (
          <ErrorBoundary key={overlay._id}>
            <Overlay
              overlay={overlay}
              onUpdate={updateOverlay}
              onDelete={deleteOverlay}
            />
          </ErrorBoundary>
        ))}
      </div>

      <div className="overlay-controls">
        <h3>Add Overlay</h3>
        <select value={newType} onChange={(e) => setNewType(e.target.value)}>
          <option value="text">Text</option>
          <option value="image">Image URL</option>
        </select>
        <input
          type="text"
          placeholder={newType === 'text' ? "Enter text..." : "Enter Image URL..."}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button onClick={createOverlay}>Add Overlay</button>
      </div>

      <p className="hint">
        Use <strong>RTSP.me</strong> to convert RTSP streams for browser playback.
        <br />
        If screen goes grey, refresh the page.
      </p>
    </div>
  )
}

export default App
