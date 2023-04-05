import React, { useState } from 'react';
import axios from 'axios';

function RoboflowDetector({ imgurl }) {
  const [results, setResults] = useState(null);

  const handleDetection = () => {
    axios({
      method: "POST",
      url: "https://detect.roboflow.com/wildfire_smoke_detection-498gm/5",
      params: {
        api_key: "vIkUHcco5ivmpVzbIkvX",
        image: imgurl // Use the imgurl prop here
      }
    })
    .then(function (response) {
      const detections = response.data['predictions'];
      setResults(detections);
    })
    .catch(function (error) {
      console.log(error.message);
    });
  }

  return (
    <div>
      <button onClick={handleDetection}>Detect Wildfire and Smoke</button>
      {results && (
        <div>
           <img src={imgurl} alt="Input Image" style={{ maxWidth: '50%', marginRight: '16px' }} />
          <div>
            {results.map((result, index) => (
              <div key={index}>
                <p>Class: {result.class}</p>
                <p>Confidence: {result.confidence.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RoboflowDetector;