import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [imageSrc, setImageSrc] = useState('');
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    // Call Roboflow API to get detections
    const apiUrl = 'https://detect.roboflow.com/?model=wildfire_smoke_detection-498gm&version=1&api_key=vIkUHcco5ivmpVzbIkvX';
    const apiKey = 'vIkUHcco5ivmpVzbIkvX';
    const params = {
      api_key: apiKey,
      image: imageSrc,
    };
    axios.post(apiUrl, { params })
      .then(response => {
        console.log(response.data);
        setDetections(response.data.predictions);
      })
      .catch(error => {
        console.error(error);
      });
  }, [imageSrc]);

  const handleImageUpload = (event) => {
    // Handle image upload and set imageSrc state
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageSrc && (
        <div style={{ position: 'relative' }}>
          <img src={imageSrc} alt="Satellite Image" />
          {detections.map((detection, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: detection.x_min + '%',
                top: detection.y_min + '%',
                width: detection.width + '%',
                height: detection.height + '%',
                border: '2px solid red',
              }}
            >
                'Smoke detected'
              <p>{detection.class}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
