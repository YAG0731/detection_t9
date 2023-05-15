import React, { useEffect, useState } from 'react';
import gifshot from 'gifshot';

function FireProgression() {
  const [gifUrl, setGifUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all the images and create an array of their URLs
    const images = [
      process.env.PUBLIC_URL + 'prediction_base.png',
      process.env.PUBLIC_URL + 'images/firstd.png',
      process.env.PUBLIC_URL + 'images/secondd.png',
      process.env.PUBLIC_URL + 'images/thirdd.png',
      process.env.PUBLIC_URL + 'images/fourthd.png',
    ];

    // Use gifshot to create a gif from the images
    gifshot.createGIF({
      images: images,
      interval: 0.5, // interval between frames in seconds
      gifWidth: 400,
      gifHeight: 400,
    }, function (obj) {
      if (!obj.error) {
        // Set the gif URL once it's created
        setGifUrl(obj.image);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000); // Show loading text for 1 second
      }
    });
  }, []);

  return (
    <div>
      {isLoading && <p>Running the prediction model...</p>}
      {gifUrl && !isLoading && <img src={gifUrl} alt="Fire progression gif" />}
    </div>
  );
}

export default FireProgression;
