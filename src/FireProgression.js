import React, { useState, useEffect } from 'react';
import PythonApp from './progressionComponents/pythonapp';

function FireProgression() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // set a 3 second timeout as an example
  }, []);

  return (
    <div style={{ height:'100%' }}>
      {isLoading ? (
        <p>Running Progression Model...</p> // show a loading message or spinner
      ) : (
        <PythonApp/> // render the PythonApp component when it's done loading
      )}
    </div>
  );
}

export default FireProgression;
