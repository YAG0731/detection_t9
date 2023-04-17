import React, { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import ReactDOM from 'react-dom';


function LandCoverMap() {
  const mapRef = useRef(null);
  const viewRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/ImageryLayer',
      'esri/widgets/Legend'
    ]).then(([Map, MapView, ImageryLayer, Legend]) => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
      // create the map
      const map = new Map();

      
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [110, 20],
        zoom: 10,
        constraints: {
          minZoom: 7
        }
      });

      // create the imagery layer
      const layer = new ImageryLayer({
        url:
          'https://ic.imagery1.arcgis.com/arcgis/rest/services/Sentinel2_10m_LandCover/ImageServer',
        title: 'Sentinel-2 10-Meter Land Use/Land Cover',
        opacity: 1
      });

      // add the imagery layer to the map
      map.add(layer);


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
      layerRef.current = layer;
      viewRef.current = view;

      // update the layer's time extent based on the selected year
      const updateTimeExtent = (selectedYear) => {
        const timeExtent = {
          start: new Date(`${selectedYear}-01-01`),
          end: new Date(`${selectedYear}-12-31`)
        };
        layer.timeExtent = timeExtent;
      };

      // create the time slider
      const TimeSlider = () => {
        const [selectedYear, setSelectedYear] = useState(2021);

        const handleChange = (event) => {
          const year = event.target.value;
          setSelectedYear(year);
          updateTimeExtent(year);
        };

        return (
          <input
            type="range"
            min="2017"
            max="2021"
            step="1"
            value={selectedYear}
            style={{
              width: '200px',
              marginTop: '200px',
              position: 'absolute',
              top: '10px',
              left: 'calc(50% - 100px)'
            }}
            onChange={handleChange}
            id="slider"
          />
        );
      };

      //ReactDOM.render(<TimeSlider />, document.getElementById('slider'));
      
      return () => {
        // cleanup logic here
        if (view) {
          view.destroy();
        }
      };
    });
  }, []);

  return (
    <div style={{ alignItems: 'left' }}>
      <header>
        <h1 style={{marginBottom:'40px'}}>Land Cover</h1>   
      </header>
      <div
        ref={mapRef}
        style={{ height: '500px', width: '500px', border: '2px solid black', maxWidth: '500px' }}
        id='slider'
      ></div>

    </div>


  );
}

export default LandCoverMap;