import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box, onImageLoad }) => (
  <div className="center ma">
    <div className="absolute mt2">
      {imageUrl && (
        <img
          id="inputimage"
          alt="Submitted for face detection"
          src={imageUrl}
          width="500"
          style={{ maxWidth: '100%', height: 'auto' }}
          onLoad={onImageLoad}
        />
      )}
      {box && <div className="bounding-box" aria-hidden="true"
        style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }} />}
    </div>
  </div>
);

export default FaceRecognition;
