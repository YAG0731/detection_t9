import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import ee from '@google/earthengine';

function FireRiskPrediction() {

    const [city, setCity] = useState(null);

    useEffect(() => {
        // Load the necessary modules for the ArcGIS API for JavaScript
        loadModules(['esri/Map', 'esri/views/MapView'], { css: true })
            .then(([Map, MapView]) => {
                // Create the map and the view using the ArcGIS API for JavaScript
                const map = new Map({ basemap: 'topo-vector' });
                const view = new MapView({
                    container: 'mapContainer',
                    center: [-118.805, 34.027],
                    zoom: 13,
                    map: map,
                });
                // Load the Earth Engine API
                window.gapi.load('client', () => {
                    window.gapi.client.load('earthengine', 'v1', () => {
                        // Initialize the Earth Engine API
                        window.gapi.auth2.getAuthInstance().signIn()
                            .then(() => {
                                // Prompt the user to select a city from the MODIS land cover dataset
                                const igbpLandCover = ee.ImageCollection('MODIS/061/MCD12Q1').select('LC_Type1');
                                const uniqueValues = igbpLandCover.reduceRegion({
                                    reducer: ee.Reducer.frequencyHistogram(),
                                    geometry: view.extent,
                                    maxPixels: 1e9,
                                    scale: 500
                                }).get('LC_Type1').getInfo();
                                const cities = Object.keys(uniqueValues);
                                const selectedCity = prompt(`Select a city from the MODIS land cover dataset: ${cities.join(', ')}`);

                                if (selectedCity && cities.includes(selectedCity)) {
                                    setCity(selectedCity);
                                } else {
                                    alert('Invalid city selected');
                                }
                                // Create a new map layer with the MODIS land cover dataset
                                const igbpLandCoverVis = {
                                    min: 1.0,
                                    max: 17.0,
                                    palette: [
                                        '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044', 'dcd159',
                                        'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44', 'a5a5a5', 'ff6d4c',
                                        '69fff8', 'f9ffa4', '1c0dff'
                                    ],
                                };
                                // Add the Earth Engine layer to the map
                                view.map.layers.add(new window.google.maps.ImageMapLayer({
                                    map: view.map,
                                    name: 'MODIS Land Cover',
                                    getTileUrl: function (tile, zoom) {
                                        return [
                                            'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/',
                                            `${selectedCity}_${zoom}_${tile.x}_${tile.y}`
                                        ].join('/');
                                    },
                                    tileSize: new window.google.maps.Size(256, 256),
                                    opacity: 0.6,
                                    zIndex: 1,
                                }));
                            })
                            .catch(error => console.log('Error:', error));
                    });
                });
            })
            .catch(error => console.log('Error:', error));
    }, []);

    return (

        <div id="mapContainer" style={{ height: '600px' }}></div>
    );
}

export default FireRiskPrediction;
