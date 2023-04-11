import React, { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

function NdviMap() {
  const mapRef = useRef(null);
  const [selectedFunction, setSelectedFunction] = useState('NDVI Colorized');
  const imageryLayerRef = useRef(null);
  const legendRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    // load the required ArcGIS API modules
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/ImageryLayer',
      'esri/layers/support/RasterFunction',
      'esri/widgets/Legend',
      'esri/widgets/Expand'
    ], { css: true })
      .then(([ArcGISMap, MapView, ImageryLayer, Layer, RasterFunction, Legend, Expand]) => {
        // destroy the previous view instance if it exists
        if (viewRef.current) {
          viewRef.current.destroy();
        }

        // create a new map instance
        const map = new ArcGISMap({
          basemap: 'satellite'
        });

        // create a new map view instance
        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [120, 22], // Los Angeles coordinates
          zoom: 7
        });

        // create a new imagery layer instance
        const imageryLayer = new ImageryLayer({
          url: 'https://landsat.arcgis.com/arcgis/rest/services/Landsat8_Views/ImageServer',
          renderingRule: {
            rasterFunction: selectedFunction,
            variableName: 'Raster'
          },
          opacity: 1
        });

        // add the imagery layer to the map
        map.add(imageryLayer);
        imageryLayerRef.current = imageryLayer;
        viewRef.current = view;

        const legend = new Legend({
          view: view
        });

        // add the legend to the map
        view.ui.add(legend, 'bottom-right');
        legendRef.current = legend;

        return () => {
          // cleanup logic here
          if (view) {
            view.destroy();
          }
          if (legendRef.current) {
            legendRef.current.destroy();
          }
        };
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedFunction]);

  useEffect(() => {
    // update the imagery layer with the new rendering rule when the selectedFunction changes
    if (imageryLayerRef.current) {
      imageryLayerRef.current.renderingRule = {
        rasterFunction: selectedFunction,
        variableName: 'Raster'
      };
    }
  }, [selectedFunction]);

  const handleSelectChange = (event) => {
    setSelectedFunction(event.target.value);
  };

  return (
    <div style={{ alignItems: 'right' }}>
      <header>
        <h1>NDVI</h1>
      </header>
      <div style={{ display: 'flex', alignItems: 'center',marginBottom:'5px' }}>
        <label htmlFor="function-select" style={{ display: 'flex', alignItems: 'center', marginRight:'5px' }}>
          Select a Raster Function:  
        </label>
        <select id="function-select" value={selectedFunction} onChange={handleSelectChange} >
          <option value="NDVI Raw"> NDVI Raw </option>
          <option value="NDVI Colorized"> NDVI Colorized </option>
          <option value="Normalized Difference Moisture Index Colorized"> Moisture </option>
          <option value="NBR Raw"> NBR Raw </option>

        </select>
      </div>
      <div
        ref={mapRef}
        style={{ height: '500px', width: '500px', border: '2px solid black', maxWidth: '500px' }}
      ></div>
    </div>
  );
}

export default NdviMap;


