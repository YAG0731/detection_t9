import React, { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

function LandCoverMap({ city }) {
  const mapRef = useRef(null);
  const imageryLayerRef = useRef(null);
  const legendRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    // load the required ArcGIS API modules
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/ImageryLayer",
      "esri/widgets/Legend",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer",
      "esri/layers/support/LabelClass",
      "esri/renderers/SimpleRenderer",
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/TextSymbol",
    ], { css: true })
      .then(([ ArcGISMap,
        MapView,
        ImageryLayer,
        Legend,
        Expand,
        FeatureLayer,
        LabelClass,
        SimpleRenderer,
        SimpleFillSymbol,
        TextSymbol,]) => {
        // destroy the previous view instance if it exists
        if (viewRef.current) {
          viewRef.current.destroy();
        }

        const countiesLayer = new FeatureLayer({
          url:
            "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Census_Counties/FeatureServer/0",
        });

        const renderer = new SimpleRenderer({
          symbol: new SimpleFillSymbol({
            color: [255, 0, 0, 0.1],
            outline: {
              color: "blue",
              width: "2px",
            },
          }),
        });

        countiesLayer.renderer = renderer;
        const imageryLayer = new ImageryLayer({
          url:
            'https://ic.imagery1.arcgis.com/arcgis/rest/services/Sentinel2_10m_LandCover/ImageServer',
          title: 'Sentinel-2 10-Meter Land Use/Land Cover',
          opacity: 1
        });

        const map = new ArcGISMap({
          basemap: "satellite",
          layers: [imageryLayer, countiesLayer],
        });
        
                                
        // create a new map view instance
        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [city.lng, city.lat], 
          zoom: 8
        });

        // create a new imagery layer instance
    
        viewRef.current = view;
        imageryLayerRef.current = imageryLayer;
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
  }, [, city]);



  const handleFormSubmit = (event) => {
    event.preventDefault();
    viewRef.current.center = [city.lng, city.lat];
    viewRef.current.zoom = 6;
    viewRef.current.goTo({ center: [city.lng, city.lat], zoom: 6 }, { duration: 2000 });
  };
  return (
    <div style={{ alignItems: 'right' }}>
      <header>
      <h1 style={{ marginBottom: '40px' }}>Land Cover</h1>
      </header>
      <form onSubmit={handleFormSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>

        </div>
      </form>
      <div
        ref={mapRef}
        style={{ height: '500px', width: '500px', border: '2px solid black', maxWidth: '500px' }}
      ></div>
    </div>
  );
}

export default LandCoverMap;


