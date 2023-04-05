import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import ImageCollection from './ImageCollection';
import FireRiskPredictionPage from './FireRiskPrediction';
import FireProgressionPage from './FireProgression';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Wildfire Detection Platform</h1>
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
          <Route path="/" element={<ImageCollection />} />
          <Route path="/fire-risk" element={<FireRiskPredictionPage />} />
          <Route path="/fire-progression" element={<FireProgressionPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
