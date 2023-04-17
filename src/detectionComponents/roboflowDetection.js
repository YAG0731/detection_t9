import React, { useState } from 'react';
import axios from 'axios';

function RoboflowDetector({ imgurl }) {
    const [results, setResults] = useState(null);
    const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
    const [selectedUrl, setSelectedUrl] = useState(1); // Default to the first URL

    const urls = [
        {
            name: 'Smoke Detection',
            url: 'https://detect.roboflow.com/wildfire_smoke_detection-498gm/5',
            apiKey: 'vIkUHcco5ivmpVzbIkvX',
        },
        {
            //https://detect.roboflow.com/?model=modis_images&version=2&api_key=9ajQQoG7JQba1FLrZX6L
            name: 'Wildfire Detection',
            url: 'https://detect.roboflow.com/modis_images/2',
            apiKey: '9ajQQoG7JQba1FLrZX6L',
        },];

    const handleDetection = () => {
        const apiUrl = urls[selectedUrl].url;
        const apiKey = urls[selectedUrl].apiKey;

        axios({
            method: 'POST',
            url: apiUrl,
            params: {
                api_key: apiKey,
                image: imgurl,
            },
        })
            .then(function (response) {
                const detections = response.data['predictions'];
                console.log(detections);
                setResults(detections);
            })
            .catch(function (error) {
                console.log(error.message);
            });
    };

    const handleImgLoad = (event) => {
        setImgDimensions({ width: event.target.width, height: event.target.height });
    };

    const img = (
        <img
            src={imgurl}
            alt="Out Image"
            style={{ width: '700px', height: '700px', marginRight: '16px' }}
            onLoad={handleImgLoad}
        />
    );

    return (
        <div>
            <div>
                {urls.map((url, index) => (
                    <button
                        key={index}
                        style={{
                            height: '40px',
                            padding: '10px',
                            margin: '20px',
                            color: selectedUrl === index ? 'white' : '#333',
                            fontSize: '16px',
                            backgroundColor: selectedUrl === index ? 'blue' : 'white',
                        }}
                        onClick={() => setSelectedUrl(index)}
                    >
                        {url.name}
                    </button>
                ))}
            </div>
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
                Detect
            </button>
            {results && results.length > 0 ? (
                <div style={{ position: 'relative' }}>
                    {img}
                    <svg
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                        }}
                    >
                        {/* Add grid lines */}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <React.Fragment key={i}>
                                {/* Vertical line */}
                                <line
                                    x1={`${(i + 1) * 5}%`}
                                    y1="0"
                                    x2={`${(i + 1) * 5}%`}
                                    y2="100%"
                                    stroke="white"
                                    strokeWidth="0.25"
                                />
                                {/* Horizontal line */}
                                <line
                                    x1="0"
                                    y1={`${(i + 1) * 5}%`}
                                    x2="100%"
                                    y2={`${(i + 1) * 5}%`}
                                    stroke="white"
                                    strokeWidth="0.25"
                                />
                            </React.Fragment>
                        ))}

                        {/* Add detection boxes */}
                        {results.map((result, index) => (
                            result.x && (
                                <React.Fragment key={index}>
                                    <rect
                                        x={result.x.toString() * 0.05 * (imgDimensions.width / result.width.toString())}
                                        y={result.y.toString() * 0.1 * (imgDimensions.height / result.height.toString())}
                                        width={result.width.toString() *0.9 * (imgDimensions.width / result.width.toString())}
                                        height={result.height.toString() * 0.5 * (imgDimensions.height / result.height.toString())}
                                        style={{
                                            stroke: 'red',
                                            strokeWidth: 1,
                                            fill: 'none',
                                        }}
                                    />
                                    <text
                                        x={result.x.toString() * 0.05 * (imgDimensions.width / result.width.toString())}
                                        y={result.y.toString() * 0.1 * (imgDimensions.height / result.height.toString()) - 5}
                                        style={{
                                            fill: 'black',
                                            stroke: 'red',
                                            strokeWidth: 1,
                                            fontSize: '30px',
                                        }}
                                    >
                                        {result.class}
                                        {result.confidence && ` (${(result.confidence * 100).toFixed(2)}%)`}
                                    </text>
                                </React.Fragment>
                            )
                        ))}
                    </svg>

                </div>
            ) : (
                <div>No thing detected</div>
            )}
        </div >
    );
}

export default RoboflowDetector;