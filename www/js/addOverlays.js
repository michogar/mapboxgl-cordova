// Depends on mapbox-gl
// Depends on readJSON

var addOverlays = function(url, map) {
  return new Promise(function (resolve, reject) {

    map.on('load', function () {
      readJSON(url).then(addOverlays).catch(reject);
    });

    function addOverlays(styles) {
      return Promise.all(getDatasourceNames(styles).map(addDatasource)).then(addStyles(styles)).then(resolve);
    }

    function getDatasourceNames(styles) {
      return Object.keys(styles.reduce(function(datasources, style) {
        datasources[style.source] = "";
        return datasources;
      }, {}));
    }

    function addDatasource(datasource) {
      return readJSON('data/' + datasource + '.geojson').then(deleteFeatureIds).then(addDataToMap(datasource));
    }

    function deleteFeatureIds(featureCollection) {
      featureCollection.features = featureCollection.features.map(deleteFeatureId);
      return featureCollection;
    }

    function deleteFeatureId(feature) {
      delete feature.id;
      return feature;
    }

    function addDataToMap(name) {
      return function(data) {
        map.addSource(name, {
          "type": "geojson",
          "data": data
        });
        return data;
      }
    }

    function addStyles(styles) {
      return function(datasources) {
        return {
          datasources: datasources,
          styles: styles.map(addStyle)
        }
      }
    }

    function addStyle(style) {
      map.addLayer(style);
      return style;
    }

  });
};
