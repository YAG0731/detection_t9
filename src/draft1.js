import React, { useState } from 'react';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import { drawGrids } from './utils/gridUtils';

const App = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);

  // function to fetch the satellite image using the location and date
  const fetchSatelliteImage = async () => {
    try {
      const response = await axios.get(`https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot
      &CRS=EPSG:4326
      &WRAP=DAY
      &TIME=2022-03-25
      &LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor
      &BBOX=29.179688,-123.969727,41.132813,-112.851563
      &FORMAT=image/jpeg
      &WIDTH=800
      &HEIGHT=800
      `);
  
      setImage(response.data.snapshotUrl);
    } catch (error) {
      console.error(error);
    }
  };
  

  // function to load the YOLO model
  const loadModel = async () => {
    try {
      const model = await tf.loadGraphModel('YOLO_MODEL_PATH');
      setModel(model);
    } catch (error) {
      console.error(error);
    }
  };

  // function to run the YOLO model on the satellite image
  const runModel = async () => {
    if (!model) {
      console.error('Model not loaded');
      return;
    }

    const tensorImage = tf.browser.fromPixels(image);
    const resizedImage = tf.image.resizeBilinear(tensorImage, [416, 416]);
    const normalizedImage = resizedImage.div(255.0);
    const batchedImage = normalizedImage.expandDims(0);

    const predictions = await model.executeAsync(batchedImage);
    setPredictions(predictions);
  };

  // function to draw the grids on the satellite image
  const drawGridsOnImage = () => {
    if (!image) {
      console.error('Image not loaded');
      return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      drawGrids(context, predictions);
      setImage(canvas.toDataURL());
    };
  };

  return (
    <div>
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={fetchSatelliteImage}>Fetch Satellite Image</button>
      <button onClick={loadModel}>Load YOLO Model</button>
      <button onClick={runModel}>Run YOLO Model</button>
      <button onClick={drawGridsOnImage}>Draw Grids</button>
      <img src={image} alt="Satellite" />
    </div>
  );
};

export default App;
