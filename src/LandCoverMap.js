import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

function LandCoverMap() {
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
        opacity: 1
      });


      // add the imagery layer to the map
      map.add(layer);

      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [120, 22],
        zoom: 12,
        constraints: {
          minZoom: 100
        }
      });

      /*var geo = view.center;
      geo.x = 120;
      geo.y = 22;

      view.goTo({
        geometry:geo,
        zoom:12
        });
        */

      // add the legend to the view
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
view.ui.add(legend, 'top-left');


      // create the time slider
      const timeSlider = document.createElement('input');
      timeSlider.type = 'range';
      timeSlider.min = '2017';
      timeSlider.max = '2021';
      timeSlider.step = '1';
      timeSlider.value = '2021';
      timeSlider.style.width = '200px';
      timeSlider.style.marginTop = '200px';
      timeSlider.style.position = 'absolute';
      timeSlider.style.top = '10px';
      timeSlider.style.left = 'calc(50% - 100px)';

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
    });
  }, []);

  return (
    <div style={{ alignItems: 'left' }}>
      <header>
        <h1>Land Cover</h1>
      </header>
      <div
        ref={mapRef}
        style={{ height: '500px', width: '500px', border: '2px solid black', maxWidth: '500px' }}
      ></div>

    </div>


  );
}

export default LandCoverMap;
