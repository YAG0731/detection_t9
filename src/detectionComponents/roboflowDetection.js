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

    const firesmokeseverity = (detections) => {
        if (detections.length === 0) {
            return [];
        }
        const severityMap = [];
        const gridWidth = Math.floor(imgDimensions.width / 20);
        const gridHeight = Math.floor(imgDimensions.height / 20);
        const subGridWidth = Math.floor(gridWidth / 3);
        const subGridHeight = Math.floor(gridHeight / 3);

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                const subGrids = [];
                let fireCount = 0;
                let smokeCount = 0;

                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        const x = i * gridWidth + k * subGridWidth;
                        const y = j * gridHeight + l * subGridHeight;
                        const subGridDetections = detections.filter(d => d.x >= x && d.x <= x + subGridWidth && d.y >= y && d.y <= y + subGridHeight);

                        subGrids.push(subGridDetections);

                        const smokeDetections = subGridDetections.filter(d => d.class === 'smoke');
                        smokeCount += smokeDetections.length;

                        const fireDetections = subGridDetections.filter(d => d.class === 'fire');
                        fireCount += fireDetections.length;
                    }
                }

                const severity = Math.max(fireCount, smokeCount) / 9;
                severityMap.push({
                    x: i * gridWidth,
                    y: j * gridHeight,
                    width: gridWidth,
                    height: gridHeight,
                    severity
                });

                console.log(`Grid (${i}, ${j}): fireCount=${fireCount}, smokeCount=${smokeCount}, severity=${severity}`);
            }
        }

        return severityMap;
    };

    const img = <img src={imgurl} alt="Out Image" style={{ width: '50%', height: '50%', marginRight: '16px' }} onLoad={handleImgLoad} />;

    return (
        <div>
            <button style={{
                height: '40px',
                padding: '10px',
                margin: '20px',
                color: '#333',
                fontSize: '16px',
            }} onClick={handleDetection
            }>Detect Wildfire and Smoke</button>
            {img}
            {results && firesmokeseverity(results).map((severity, index) => (
                <div key={index} style={{
                    position: 'relative',
                    left: severity.x,
                    top: severity.y,
                    width: severity.width,
                    height: severity.height,
                    backgroundColor: severity.severity > 0 ? severity.severity > 0.5 ? 'red' : 'yellow' : 'transparent'
                }}></div>
            ))}
        </div>
    );
}    
export default RoboflowDetector;