// Depends on mapbox-gl
// Depends on readJSON
// Depends on addOverlays

readJSON('styles/dark-matter.json').then(completeLocalUrls).then(instantiateMap);

function completeLocalUrls(style) {
  var path = location.origin + location.pathname.split("/").slice(0, -1).join("/") + "/";
  style.sources.openmaptiles.tiles = style.sources.openmaptiles.tiles.map(function(url) { return path + url });
  style.sprite = path + style.sprite;
  return style;
}

function instantiateMap(style) {
  var map = new mapboxgl.Map({
    container: 'map',
    style: style,
    hash: true
  });

  var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-right');

  addOverlays('styles/overlays.json', map).then(addInteraction);

  function addInteraction() {
    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, {layers: ['estacions']});
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

    map.on('click', function (e) {
      var estacions = map.queryRenderedFeatures(e.point, {layers: ['estacions']});
      if (estacions.length) {
        map.flyTo({center: estacions[0].geometry.coordinates});
        var html = estacions.map(function (estacio) {
          return estacio.properties.NOM_LINIA + " - " + estacio.properties.NOM_ESTACIO;
        }).join("<br/>");
        new mapboxgl.Popup().setLngLat(estacions[0].geometry.coordinates).setHTML(html).addTo(map);
      }
    });
  }
}
