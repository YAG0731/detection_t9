import React, { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

function Geotest() {
  const mapRef = useRef(null);
  const viewRef = useRef(null);
  const geojsonLayerRef = useRef(null);

  useEffect(() => {
    // load the required ArcGIS API modules
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/ImageryLayer',
      'esri/layers/GeoJSONLayer'
    ], { css: true })
      .then(([ArcGISMap, MapView, ImageryLayer, GeoJSONLayer]) => {
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
          center: [-118.2437, 34.0522], // Los Angeles coordinates
          zoom: 10
        });

        // create a new imagery layer instance
        const imageryLayer = new ImageryLayer({
          url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
          title: 'World Imagery'
        });

        // add the imagery layer to the map
        map.add(imageryLayer);

        // create a new geojson layer instance
        const geojsonLayer = new GeoJSONLayer({
          url: 'counties.json',
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [51, 51, 204, 0.9],
              outline: {
                color: [255, 255, 255],
                width: 1
              }
            }
          }
        });

        // add the GeoJSON layer to the map
        map.add(geojsonLayer);
        geojsonLayerRef.current = geojsonLayer;

        viewRef.current = view;

        return () => {
          // cleanup logic here
          if (view) {
            view.destroy();
          }
        };
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // update the imagery layer with the new rendering rule when the selectedFunction changes

  }, []);


  return (
    <div style={{ alignItems: 'right' }}>
      <header>
        <h1>NDVI</h1>
      </header>
      <div style={{ display: 'flex', alignItems: 'center',marginBottom:'5px' }}>

      </div>
      <div
        ref={mapRef}
        style={{ height: '500px', width: '500px', border: '2px solid black', maxWidth: '500px' }}
      ></div>
    </div>
  );
}

export default Geotest;
