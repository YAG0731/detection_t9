import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

function NdviMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    // load the required ArcGIS API modules
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/ImageryLayer',
      'esri/layers/Layer',
      'esri/layers/support/RasterFunction'
    ], { css: true })
      .then(([ArcGISMap, MapView, ImageryLayer, Layer, RasterFunction,Legend]) => {
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
            rasterFunction: 'NDVI Colorized',
            variableName: 'Raster'
          },
          opacity: 1
        });

        // add the imagery layer to the map
        map.add(imageryLayer);

        const legend = new Legend({
          view: view,
          style: {
            height: '200px',
            width: '200px'
          },
          layerInfos: [
            {
              layer: imageryLayer,
              title: 'NDVI Risk Prediction USA',
              defaultSymbolEnabled: false
            }
          ]
        });
        view.ui.add(legend, 'bottom-right');

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

  return (
    <div style={{ alignItems: 'right' }}>
      <header>
        <h1>Moisture Index</h1>
      </header>
      <div
        ref={mapRef}
        style={{ height: '500px', width: '500px', border: '2px solid black', maxWidth: '500px' }}
      ></div>

    </div>
  );
}

export default NdviMap;
