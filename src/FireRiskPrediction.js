import React, { useEffect, useRef, useState } from 'react';
import NdviMap from './riskComponents/NdviMap';
import LandCoverMap from './riskComponents/LandCoverMap';

const cities = [
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  {name:'KaoHsiung',lat:22.6273,lng:120.3017},
  // add more cities here
];

function FireRiskPrediction() {
  const [city, setCity] = useState(cities[0]);
  const [selectedCity, setSelectedCity] = useState(city.name);
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const selected = cities.find(c => c.name === selectedCity);
    if (selected) {
      setCity(selected);
    }
  };

  useEffect(() => {
    if (city) {
      // do something with city
    }
  }, [city]);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '10px' }}>Fire Risk Prediction</h1>
      <form onSubmit={handleSubmit}>
        <label style={{marginRight:'10px', fontSize:'20px'}} >
          Select a city:
          <select class="my-select" value={selectedCity} onChange={handleCityChange}>
            {cities.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <button className='my-select ' type="submit">Submit</button>
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '8%', marginRight: '8%' }}>
        <LandCoverMap city={city} />
        <NdviMap city={city} />
      </div>
    </div>
  );
}

export default FireRiskPrediction;
