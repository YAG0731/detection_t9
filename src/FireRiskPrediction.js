import React, { useEffect, useRef, useState } from 'react';
import NdviMap from './riskComponents/NdviMap';
import LandCoverMap from './riskComponents/LandCoverMap';

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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '8%', marginRight: '8%' }}>
                <LandCoverMap city={city} />
                <NdviMap city={city} />
            </div>
        </div>
    );
}

export default FireRiskPrediction;
