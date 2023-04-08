import React, { useState } from 'react';
import axios from 'axios';

function RoboflowDetector({ imgurl }) {
  const [results, setResults] = useState(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [showImage, setShowImage] = useState(false);

  const handleDetection = () => {
    axios({
      method: 'POST',
      url: 'https://detect.roboflow.com/wildfire_smoke_detection-498gm/5',
      params: {
        api_key: 'vIkUHcco5ivmpVzbIkvX',
        image: imgurl, // Use the imgurl prop here
      },
    })
      .then(function (response) {
        const detections = response.data['predictions'];
        setResults(detections);
        setShowImage(true);
        detections.forEach((detection) => console.log(detection.x));
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const handleImgLoad = (event) => {
    setImgDimensions({ width: event.target.width, height: event.target.height });
  };

  let img = null;
  if (showImage) {
    if (results && results.length > 0) {
      img = (
        <img
          src={imgurl}
          alt="Out Image"
          style={{ width: '50%', height: '50%', marginBottom: '16px' }}
          onLoad={handleImgLoad}
        />
      );
    } else {
      img = <p>No thing detected</p>;
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <button
        style={{
          height: '40px',
          padding: '10px',
          margin: '20px',
          color: '#333',
          fontSize: '16px',
        }}
        onClick={handleDetection}
      >
        Detect Wildfire and Smoke
      </button>
      {img}
    </div>
  );
}

export default RoboflowDetector;
