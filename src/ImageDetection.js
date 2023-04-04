import React, { useEffect } from 'react';

const API_ENDPOINT = 'https://detect.roboflow.com/wildfire_smoke_detection-498gm/1';
const API_KEY = 'vIkUHcco5ivmpVzbIkvX';

function ImageDetection() {
  useEffect(() => {
    fetch('https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&CRS=EPSG:4326&TIME=2023-04-01&WRAP=DAY&BBOX=37.345276,-123.082581,38.438416,-121.967468&FORMAT=image/jpeg&WIDTH=508&HEIGHT=498&AUTOSCALE=FALSE&ts=1680578520515')
      .then(response => response.blob())
      .then(blob => {
        const img = new Image();
        img.onload = () => {
          detectObjectsOnImage(img);
        };
        img.src = URL.createObjectURL(blob);
      })
      .catch(error => console.error(error));
  }, []);

  function detectObjectsOnImage(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const payload = {
      image: img,
      modelId: 'wildfire_smoke_detection-498gm',
      api_key: API_KEY,
    };
    fetch(`${API_ENDPOINT}/infer`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        data.predictions.forEach(prediction => {
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.strokeRect(prediction.x, prediction.y, prediction.width, prediction.height);
          ctx.fillStyle = 'red';
          ctx.fillText(prediction.class, prediction.x, prediction.y - 5);
        });
        document.body.appendChild(canvas);
      })
      .catch(error => console.error(error));
  }

  return null;
}

export default ImageDetection;
