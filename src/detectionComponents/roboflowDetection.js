import React, { useState } from 'react';
import axios from 'axios';

function RoboflowDetector({ imgurl }) {
    const [results, setResults] = useState(null);
    const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

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
                console.log(detections)
                setResults(detections);
                detections.forEach(detection => console.log(detection.x))
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    const handleImgLoad = (event) => {
        setImgDimensions({ width: event.target.width, height: event.target.height });
    };

    const img = <img src={imgurl} alt="Out Image" style={{ width: '700px', height: '700px', marginRight: '16px' }} onLoad={handleImgLoad} />;

    return (
        <div>
            <button style={{
                height: '40px',
                padding: '10px',
                margin: '20px',
                borderRadius: '5px',
                color: '#333',
                fontSize: '16px',
            }} onClick={handleDetection}>Detect Wildfire and Smoke</button>
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
                                        x={result.x.toString() * 0.02 * (imgDimensions.width / result.width.toString())}
                                        y={result.y.toString() * 0.01 * (imgDimensions.height / result.height.toString())}
                                        width={result.width.toString() * 0.98 * (imgDimensions.width / result.width.toString())}
                                        height={result.height.toString() * 0.66 * (imgDimensions.height / result.height.toString())}
                                        style={{
                                            stroke: 'red',
                                            strokeWidth: 1,
                                            fill: 'none',
                                        }}
                                    />
                                    <text
                                        x={result.x.toString() * 0.02 * (imgDimensions.width / result.width.toString())}
                                        y={result.y.toString() * 0.01 * (imgDimensions.height / result.height.toString()) +15}
                                        style={{
                                            fill: 'green',
                                            stroke: 'red',
                                            strokeWidth: 0.5,
                                            fontSize: '20px',
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
                <div style={{ margin:'10px' }}>***Nothing detected***</div>
            )}
        </div >
    );
}

export default RoboflowDetector;