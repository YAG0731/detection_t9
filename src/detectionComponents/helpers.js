import React, { useState } from 'react';
import axios from 'axios';
//import { calculateSeverity } from './helpers';

function RoboflowDetector({ imgurl }) {
  const [results, setResults] = useState(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const handleDetection = () => {
    axios({
      method: 'POST',
      url: 'https://detect.roboflow.com/wildfire_smoke_detection-498gm/5',
      params: {
        api_key: 'vIkUHcco5ivmpVzbIkvX',
        image: imgurl // Use the imgurl prop here
      }
    })
      .then(function(response) {
        const detections = response.data['predictions'];
        console.log(detections);
        setResults(detections);
        detections.forEach(detection => console.log(detection.x));
      })
      .catch(function(error) {
        console.log(error.message);
      });
  };

  const handleImgLoad = event => {
    setImgDimensions({ width: event.target.width, height: event.target.height });
  };

  const imgStyle = {
    width: '50%',
    height: '50%',
    marginBottom: '16px'
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <button style={{ padding: '8px 16px', borderRadius: '4px', fontSize: '18px' }} onClick={handleDetection}>
          Detect Wildfire and Smoke
        </button>
      </div>
      {results && (
        <div style={{ position: 'relative' }}>
          <img src={imgurl} alt="Out Image" style={imgStyle} onLoad={handleImgLoad} />

          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            {results.map(
              (result, index) =>
                result.x && (
                  <React.Fragment key={index}>
                    <rect
                      x={result.x.toString() * 0.5 * (imgDimensions.width / result.width.toString())}
                      y={result.y.toString() * 0.5 * (imgDimensions.height / result.height.toString())}
                      width={result.width.toString() * 0.5 * (imgDimensions.width / result.width.toString())}
                      height={result.height.toString() * 0.5 * (imgDimensions.height / result.height.toString())}
                      style={{
                        stroke: 'red',
                        strokeWidth: 2,
                        fill: 'none'
                      }}
                    />
                    <text
                      x={result.x.toString() * 0.5 * (imgDimensions.width / result.width.toString())}
                      y={result.y.toString() * 0.5 * (imgDimensions.height / result.height.toString()) - 5}
                      style={{
                        fill: 'white',
                        stroke: 'red',
                        strokeWidth: 0.5,
                        fontSize: '20px'
                      }}
                    >
                      {result.class}
                      {result.confidence && ` (${(result.confidence * 100).toFixed(2)}%)`}
                    </text>
                  </React.Fragment>
                )
            )}
          </svg>
        </div>
      )}
    </div>
  );
}

export default RoboflowDetector;
