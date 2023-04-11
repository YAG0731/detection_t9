import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import FireDetection from './FireDetection';
import FireProgression from './FireProgression';
import './App.css';

import FireRiskPrediction from './FireRiskPrediction';

function App() {
  return (
    <div className="App">
      <h1>Intelligent Wildfire Detection and Progression Analysis Plateform</h1>
      <BrowserRouter>
        <nav>
          <ul className="nav-links">
            <li>
              <Link className="link" to="/">Detection</Link>
            </li>
            <li>
              <Link className="link" to="/fire-risk">Fire Risk</Link>
            </li>
            <li>
              <Link className="link" to="/fire-progression">Fire Progression</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<FireDetection />} />
          <Route path="/fire-risk" element={<FireRiskPrediction />} />
          <Route path="/fire-progression" element={<FireProgression />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
