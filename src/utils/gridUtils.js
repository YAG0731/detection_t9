// define the fire color range for the YOLO model
const FIRE_COLOR_RANGE = {
  'rgba(255, 0, 0, 255)': true, // red
  'rgba(255, 69, 0, 255)': true, // orange
  'rgba(255, 165, 0, 255)': true, // dark orange
  'rgba(255, 255, 0, 255)': true, // yellow
};

// function to draw the grids on the satellite image
const drawGrids = (image, setImage) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  const gridSize = 50;
  const numRows = Math.floor(image.height / gridSize);
  const numCols = Math.floor(image.width / gridSize);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const x = j * gridSize;
      const y = i * gridSize;
      const imageData = context.getImageData(x, y, gridSize, gridSize);
      const pixelData = imageData.data;
      const numPixels = gridSize * gridSize;
      let firePixels = 0;

      // loop through the pixel data and count the number of fire pixels
      for (let k = 0; k < numPixels; k++) {
        const red = pixelData[k * 4];
        const green = pixelData[k * 4 + 1];
        const blue = pixelData[k * 4 + 2];
        const alpha = pixelData[k * 4 + 3];
        const pixelColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

        // check if the pixel color is in the fire color range
        if (pixelColor in FIRE_COLOR_RANGE) {
          firePixels++;
        }
      }

      // calculate the fire severity based on the number of fire pixels
      const severity = firePixels / numPixels;

      // draw the grid on the canvas with a color based on the fire severity
      context.strokeStyle = getGridColor(severity);
      context.strokeRect(x, y, gridSize, gridSize);
    }
  }

  const gridedImage = canvas.toDataURL();
  setImage(gridedImage);
};

// helper function to get the grid color based on the fire severity
const getGridColor = (severity) => {
  if (severity < 0.1) {
    return '#00FF00'; // green
  } else if (severity < 0.3) {
    return '#FFFF00'; // yellow
  } else if (severity < 0.5) {
    return '#FFA500'; // orange
  } else {
    return '#FF0000'; // red
  }
};

export { drawGrids };
