// Depends on mapbox-gl
// Depends on readJSON

function completeRelativeUrls(style) {
  var path = location.origin + location.pathname.split("/").slice(0, -1).join("/") + "/";
  Object.keys(style.sources).map(function(sourcename) {
    var source = style.sources[sourcename];
    if(source.hasOwnProperty('data')) {
      source.data = path + source.data;
    }
    if(source.hasOwnProperty('tiles')) {
      source.tiles = source.tiles.map(function (url) {
        return path + url
      });
    }
  });

  if(style.hasOwnProperty('sprite')) {
    style.sprite = path + style.sprite;
  }
  return style;
}

function addStyle(map) {
  return function(style) {
    addSources(map, style.sources).then(addLayers(map, style.layers));
    return style;
  }
}

function addSources(map, sources) {
  var promises = [];
  for(var id in sources) {
    var source = sources[id];
    if(isGeojsonUrl(source)) {
      promises.push(readJSON(source.data).then(deleteFeatureIds).then(replaceData(source)).then(addSource(map, id)));
    } else {
      addSource(map, id)(source);
    }
  }
  return Promise.all(promises);
}

function deleteFeatureIds(featureCollection) {
  featureCollection.features = featureCollection.features.map(deleteFeatureId);
  return featureCollection;
}

function deleteFeatureId(feature) {
  delete feature.id;
  return feature;
}

function replaceData(source) {
  return function(data) {
    source.data = data;
    return source;
  }
}

function isGeojsonUrl(source) {
  return source.type == "geojson" && (typeof source.data === 'string' || source.data instanceof String);
}

function addSource(map, id) {
  return function(source) {
    map.addSource(id, source);
    return source;
  }
}

function addLayers(map, layers) {
  return function() {
    layers.map(function(layer){
      map.addLayer(layer);
    });
  }
}
