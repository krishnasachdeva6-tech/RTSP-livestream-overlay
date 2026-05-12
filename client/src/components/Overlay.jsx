import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const Overlay = ({ overlay, onUpdate, onDelete }) => {
  const nodeRef = useRef(null);

  // Ensure we have valid numbers
  const safeX = Number(overlay.x) || 0;
  const safeY = Number(overlay.y) || 0;
  const safeW = Number(overlay.width) || 100;
  const safeH = Number(overlay.height) || 50;

  const [position, setPosition] = useState({ x: safeX, y: safeY });
  const [size, setSize] = useState({ width: safeW, height: safeH });

  const handleDragStop = (e, data) => {
    // data.x/y are the new absolute positions
    const newPos = { x: data.x, y: data.y };
    setPosition(newPos);
    onUpdate(overlay._id, { ...newPos });
  };

  const handleResizeStop = (e, { size }) => {
    setSize(size);
    onUpdate(overlay._id, { ...size });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={handleDragStop}
      bounds="parent"
      cancel=".react-resizable-handle" // Prevent dragging when clicking resize handle
    >
      <div
        ref={nodeRef}
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <ResizableBox
          width={size.width}
          height={size.height}
          onResizeStop={handleResizeStop}
          minConstraints={[50, 20]}
          maxConstraints={[800, 450]}
          className={`overlay-item ${overlay.type === 'image' ? 'image-overlay' : ''}`}
          draggableOpts={{ enableUserSelectHack: false }}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            {overlay.type === 'image' ? (
              <img
                src={overlay.content}
                alt="overlay"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none'; // Hide broken image
                  e.target.parentNode.style.backgroundColor = '#333';
                  const span = document.createElement('span');
                  span.innerText = '⚠️ Image Failed';
                  span.style.color = 'red';
                  span.style.display = 'flex';
                  span.style.justifyContent = 'center';
                  span.style.alignItems = 'center';
                  span.style.height = '100%';
                  e.target.parentNode.appendChild(span);
                }}
              />
            ) : (
              <span style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                wordBreak: 'break-word',
                padding: '5px'
              }}>
                {overlay.content}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag start
                onDelete(overlay._id);
              }}
              onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '12px',
                lineHeight: '1',
                zIndex: 10
              }}
            >
              X
            </button>
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default Overlay;
