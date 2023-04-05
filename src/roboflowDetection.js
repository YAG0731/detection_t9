import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function RoboflowDetector({ imgurl }) {
    const [results, setResults] = useState(null);
    const canvasRef = useRef(null);

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
                setResults(detections);
                console.log(detections)
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    useEffect(() => {
        const renderBoundingBoxes = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw bounding boxes on the image
            if (results && results.length > 0) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                for (let i = 0; i < results.length; i++) {
                    const prediction = results[i];
                    const x = prediction['x'] * canvas.width;
                    const y = prediction['y'] * canvas.height;
                    const width = prediction['width'] * canvas.width;
                    const height = prediction['height'] * canvas.height;
                    ctx.beginPath();
                    ctx.rect(x, y, width, height);
                    ctx.stroke();
                }
            }
        }

        renderBoundingBoxes();
    }, [results]);

    return (
        <div>
            <button onClick={handleDetection}>Detect Wildfire and Smoke</button>
            <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
        </div>
    );
}

export default RoboflowDetector;
