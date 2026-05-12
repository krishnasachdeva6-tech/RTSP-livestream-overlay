# RTSP Livestream Overlay Application

A web application that plays a livestream video from an RTSP source and allows users to create, manage, and display custom overlays on top of the video in real time.

## 📋 Features
- **Livestream Playback**: Supports RTSP (via conversion) and standard HTTP streams (HLS/MP4).
- **Interactive Overlays**:
    - **Text & Image** support.
    - **Drag & Drop** positioning.
    - **Resizable** elements.
- **CRUD Management**: Create, Read, Update, and Delete overlays via REST API.
- **Persistence**: All overlay settings are saved in **MongoDB**.

## 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Python (Flask)
- **Database**: MongoDB

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** & **npm**
- **Python 3.8+**
- **MongoDB** (Running locally on port 27017)

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install flask pymongo flask-cors
   ```
4. Start the server:
   ```bash
   python app.py
   ```
   *The server will run on `http://localhost:5000`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

## 📖 Usage Guide

### Livestream
1. Enter your stream URL in the input box at the top (e.g., `http://sample-url.com/video.mp4`).
2. Click **Play**.
3. *Note on RTSP*: Browsers do not support raw `rtsp://` links. Please use a service like [RTSP.me](https://rtsp.me) to convert your stream to HTTP, or use a local proxy like `rtsp-simple-server`.

### Managing Overlays
- **Add**: Scroll to the bottom "Add Overlay" section. Choose "Text" or "Image", enter content/URL, and click "Add".
- **Move**: Click and drag any overlay on the video to position it.
- **Resize**: Drag the bottom-right handle of a selected overlay to resize it.
- **Delete**: Click the red **X** button on the top-right of an overlay.

## 📡 API Documentation

### Base URL: `/api/overlays`

| Method | Endpoint | Description | Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all overlays | - |
| `POST` | `/` | Create overlay | `{ "type": "text/image", "content": "...", "x": 0, "y": 0, ... }` |
| `PUT` | `/<id>` | Update overlay | `{ "x": 100, "y": 200, ... }` |
| `DELETE`| `/<id>` | Delete overlay | - |

## 📦 Project Structure
```
/assignment
  /server         # Flask Backend
    app.py
  /client         # React Frontend
    /src
      /components
        Overlay.jsx
        VideoPlayer.jsx
      App.jsx
```
