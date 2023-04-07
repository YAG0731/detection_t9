import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

function FireRiskPrediction() {
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
          'https://ic.imagery1.arcgis.com/arcgis/rest/services/Sentinel2_10m_LandCover/ImageServer',
        title: 'Sentinel-2 10-Meter Land Use/Land Cover',
        opacity: 0.8
      });

      // add the imagery layer to the map
      map.add(layer);

      // create the map view
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-100, 40],
        zoom: 4,
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
            title: 'Land Cover',
            hideLayers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            defaultSymbolEnabled: false
          }
        ]
      });
      view.ui.add(legend, 'bottom-left');

      // create the time slider
      const timeSlider = document.createElement('input');
      timeSlider.type = 'range';
      timeSlider.min = '2017';
      timeSlider.max = '2021';
      timeSlider.step = '1';
      timeSlider.value = '2021';
      timeSlider.style.width = '200px';
      timeSlider.style.marginTop = '10px';

      // add the time slider to the view
      view.ui.add(timeSlider, 'manual');

      // update the layer's time extent based on the selected year
      timeSlider.addEventListener('input', (event) => {
        const selectedYear = event.target.value;
        const timeExtent = {
          start: new Date(`${selectedYear}-01-01`),
          end: new Date(`${selectedYear}-12-31`)
        };
        layer.timeExtent = timeExtent;
      });
    });
  }, []);

  return <div ref={mapRef} style={{ height: '800px', width:'800px', float:'left' }} />;
}

export default FireRiskPrediction;
