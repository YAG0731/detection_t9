import React, { useEffect, useRef, useState } from 'react';
import NdviMap from './NdviMap';
import LandCoverMap from './LandCoverMap';

function FireRiskPrediction() {
    const [city, setCity] = useState('San Jose');
    const inputRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        setCity(inputRef.current.value);
    };

    useEffect(() => {
        if (city) {
            
        }
    }, [city]);

    return (
        <div>
            <h1 style={{ marginBottom: '50px' }}>Fire Risk Prediction</h1>
            <form  onSubmit={handleSubmit}>
                <label>
                    Enter a city: 
                    <input style={{ marginLeft: '10px' }} type="text" ref={inputRef} />
                </label>
                <button type="submit">Submit</button>
            </form>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '10px', marginRight: '10px' }}>
                <LandCoverMap city={city} />
                <NdviMap city={city} />
            </div>
        </div>
    );
}

export default FireRiskPrediction;
