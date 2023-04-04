import React, { useState } from 'react';
import Jimp from 'jimp';
import * as tf from '@tensorflow/tfjs';
import * as tfjsYolo from '@tensorflow-models/yolo';

function App() {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [processedImage, setProcessedImage] = useState(null);
  const [fireSeverity, setFireSeverity] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Convert the location to BBOX format
    const bbox = await getBBox(city);
    // Retrieve the satellite image
    const imageUrl = `https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&TIME=${date}&BBOX=${bbox}&CRS=EPSG:4326&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&FORMAT=image/jpeg&WIDTH=400&HEIGHT=400&ts=${Date.now()}`;
    const image = await Jimp.read(imageUrl);
    // Draw the 50x50 grids on the satellite image
    const processedImage = drawGrids(image);
    setProcessedImage(processedImage);
    // Pass the processed image to the YOLO model to detect wildfire and smoke
    const yoloModel = await tfjsYolo.load();
    const predictions = await yoloModel.predict(processedImage);
    // Calculate the fire severity for each 9-grids set
    const fireSeverity = calculateFireSeverity(predictions);
    setFireSeverity(fireSeverity);
  };

  const getBBox = async (city) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json`);
    const data = await response.json();
    const { lat, lon } = data[0];
    const buffer = 0.1;
    const bbox = `${Number(lon) - buffer},${Number(lat) - buffer},${Number(lon) + buffer},${Number(lat) + buffer}`;
    return bbox;
  };
  
  const drawGrids = (image) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.strokeRect(x, y, gridSize, gridSize);
      }
    }
    return canvas.toDataURL();
  };
  

  const calculateFireSeverity = (imageData) => {
    const gridSize = 50;
    const gridCountX = Math.floor(imageData.width / gridSize);
    const gridCountY = Math.floor(imageData.height / gridSize);
    const gridCount9 = (gridCountX - 2) * (gridCountY - 2);
    const gridData = new Array(gridCount9).fill(0);
    const data = imageData.data;
    for (let y = gridSize; y < imageData.height - gridSize; y += gridSize) {
      for (let x = gridSize; x < imageData.width - gridSize; x += gridSize) {
        const offset = (y * imageData.width + x) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        if (r > 200 && g < 100 && b < 100) {
          const gridX = Math.floor((x - gridSize) / gridSize);
          const gridY = Math.floor((y - gridSize) / gridSize);
          const gridIndex = gridY * (gridCountX - 2) + gridX;
          gridData[gridIndex]++;
        }
      }
    }
    const maxGridCount = 9;
    const fireSeverity = new Array(gridCount9).fill(0);
    for (let i = 0; i < gridCount9; i++) {
      for (let j = i; j < i + maxGridCount; j++) {
        fireSeverity[i] += gridData[j];
      }
    }
    return fireSeverity;
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {processedImage && <img src={processedImage} alt="Processed Image" />}
      {fireSeverity &&
        fireSeverity.map((severity, index) => (
          <div key={index}>Grid {index + 1} Severity: {severity}</div>
        ))}
    </div>
  );
}

export default App;
