import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ url, isPlaying, volume }) => {
    const videoRef = useRef(null);

    // Helper to determine if we should use an iframe (e.g. RTSP.me)
    const isIframe = (url) => {
        return url.includes('rtsp.me') || url.includes('<iframe');
    }

    // Helper to extract src from iframe code if user pasted full HTML
    const getIframeSrc = (url) => {
        if (url.includes('rtsp.me') && !url.includes('<iframe')) {
            // If it's just the link 'https://rtsp.me/embed/...' or main page
            // Basic heuristic: ensure it points to embed? 
            // RTSP.me usually gives: https://rtsp.me/embed/their-id/
            return url;
        }
        if (url.includes('src="')) {
            const match = url.match(/src="([^"]+)"/);
            return match ? match[1] : url;
        }
        return url;
    }

    useEffect(() => {
        if (videoRef.current && !isIframe(url)) {
            if (isPlaying) videoRef.current.play().catch(e => console.log("Play error", e));
            else videoRef.current.pause();

            videoRef.current.volume = volume;
        }
    }, [isPlaying, volume, url]);

    if (isIframe(url)) {
        return (
            <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                {/* pointerEvents: none ensures clicks go to the overlays on top, 
            but it breaks video controls inside iframe. 
            Trade-off: To drag overlays, we need to capture mouse events. 
            If user wants to control video, controls need to be outside (which api gives) 
            OR we use z-index carefully. 
            For this assignment, overlays are key. 
        */}
                <iframe
                    src={getIframeSrc(url)}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowdoc="true"
                />
            </div>
        )
    }

    return (
        <video
            ref={videoRef}
            className="video-element"
            src={url}
            loop
            muted={volume === 0}
            crossOrigin="anonymous"
        >
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoPlayer;
