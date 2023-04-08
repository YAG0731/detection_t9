import { loadModules } from 'esri-loader';

function geocode(address, callback) {
  loadModules(['esri/tasks/GeocodeTask', 'esri/tasks/support/GeocodeParameters']).then(
    ([GeocodeTask, GeocodeParameters]) => {
      const geocodeTask = new GeocodeTask({
        url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
      });

      const params = new GeocodeParameters({
        address: {
          singleLine: address
        },
        outFields: ['*']
      });

      geocodeTask
        .geocode(params)
        .then((response) => {
          const [result] = response.results;
          callback({
            x: result.extent.center.x,
            y: result.extent.center.y,
            zoom: 10,
            county: result.attributes.Subregion
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  );
}

export default geocode;
