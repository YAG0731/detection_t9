import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';

function FireRiskPrediction() {
    const [map, setMap] = useState(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules([
            "esri/config",
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Search",
            "esri/layers/MapImageLayer",
            "esri/widgets/Popup"
        ], { css: true })
            .then(([esriConfig, Map, MapView, Search, MapImageLayer, Popup]) => {
                // configure the ArcGIS API key
                esriConfig.apiKey = "AAPK553f2d7b5ba14ddeb7d7c84b002a6af29b6u1zso-l474jVx0LXlAgHSZHwJ3pOC4EttPRQPS_soxYE7RGkiXSbFRl4m5Daj";

                // create a new Map instance with the specified basemap
                const map = new Map({
                    basemap: "arcgis-topographic"
                });

                // create a new MapView instance and set the map property to the created map
                const view = new MapView({
                    container: "viewDiv",
                    map: map,
                    center: [-98.5795, 39.8283], // the initial center of the map (in this case, the center of the US)
                    zoom: 4 // the initial zoom level of the map
                });

                // create a new Search widget instance and set the view property to the created map view
                const searchWidget = new Search({
                    view: view,
                    container: "searchContainer",
                    allPlaceholder: "Enter a city name",
                    includeDefaultSources: false,
                    sources: [
                        {
                            featureLayer: new MapImageLayer({
                                url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer",
                                popupTemplate: new Popup({
                                    title: "{CITY_NAME}, {CNTRY_NAME}",
                                    content: "Population: {POPULATION}"
                                })
                            }),
                            searchFields: ["CITY_NAME"],
                            displayField: "CITY_NAME",
                            exactMatch: false,
                            outFields: ["*"],
                            name: "City Name",
                            placeholder: "Example: New York",
                            maxResults: 6,
                            maxSuggestions: 6,
                            suggestionsEnabled: true,
                            minSuggestCharacters: 0
                        }
                    ]
                });

                // add the search widget to the view
                view.ui.add(searchWidget, {
                    position: "top-right"
                });

                // listen for the search widget to return results and zoom to the selected location
                searchWidget.on("select-result", function (event) {
                    view.goTo({
                        target: event.result.extent,
                        zoom: 12
                    });
                });

                // create a new MapImageLayer instance with the specified URL
                const wildfireRisk = new MapImageLayer({
                    url: "https://maps7.arcgisonline.com/arcgis/rest/services/USDA_USFS_2014_Wildfire_Hazard_Potential/MapServer"
                });

                map.add(wildfireRisk);

                // set the map and view states
                setMap(map);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSearch = () => {
        // check if map and search widget are initialized
        if (map && map.loaded && searchText) {
            // get the search widget
            const searchWidget = map.findLayerById("search-widget");
            // execute a search using the search text
            searchWidget.search(searchText);
        }
    };

    return (
        <div>
            <div id="searchContainer" className="search-container"></div>
            <div className="search-box">
                <input type="text" value={searchText} onChange={handleSearchTextChange} placeholder="Enter a city name" />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div id="viewDiv" className="map-container"></div>
        </div>
    );
}

export default FireRiskPrediction;