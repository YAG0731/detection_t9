import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

function NdviRiskMap() {
  const mapRef = useRef(null);
  
  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/ImageryLayer',
      'esri/widgets/Legend'
    ]).then(([Map, MapView, ImageryLayer, Legend]) => {
      // create the map
      const map = new Map();

      // create the imagery layer
      const layer = new ImageryLayer({
        url:
          'https://landsat2.arcgis.com/arcgis/rest/services/Landsat8_Views/ImageServer',
          bandIds: [5, 4],
        title: 'NDVI',
        opacity: 1
      });

      // add the imagery layer to the map
      map.add(layer);

      // create the map view
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-100, 40],
        zoom: 10,
        constraints: {
          minZoom: 3
        }
      });

      // add the legend to the view
      const legend = new Legend({
        view: view,
        style: {
          height: '200px',
          width: '200px'
        },
        layerInfos: [
          {
            layer: layer,
            title: 'NDVI Risk Prediction USA',
            defaultSymbolEnabled: false
          }
        ]
      });
      view.ui.add(legend, 'bottom-right');

      /*
      // create the time slider
      const timeSlider = document.createElement('input');
      timeSlider.type = 'range';
      timeSlider.min = '2017';
      timeSlider.max = '2022';
      timeSlider.step = '1';
      timeSlider.value = '2022';
      timeSlider.style.width = '200px';

      timeSlider.style.marginTop = '100px';
      timeSlider.style.position = 'absolute';
      timeSlider.style.top = '10px';
      timeSlider.style.left = 'calc(100px - 50%)';

      // add the time slider to the view
      const header = document.getElementsByTagName('header')[0];
      header.appendChild(timeSlider);

      // update the layer's time extent based on the selected year
      timeSlider.addEventListener('input', (event) => {
        const selectedYear = event.target.value;
        const timeExtent = {
          start: new Date(`${selectedYear}-01-01`),
          end: new Date(`${selectedYear}-12-31`)
        };
        layer.timeExtent = timeExtent;
      });
      */
    });
  }, []);

  return (
    <div style={{ alignItems: 'right' }}>
      <header>
        <h1>NDVI</h1>
      </header>
      <div
        ref={mapRef}
        style={{ height: '500px', width: '500px', border: '2px solid black', maxWidth: '500px'  }}
      ></div>
    </div>


  );
}

export default NdviRiskMap;
