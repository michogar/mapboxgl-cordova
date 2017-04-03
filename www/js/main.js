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

  function addInteraction(overlays) {
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

    /*
    map['dragPan'].disable();
    var i=0;
    var gestures = new Hammer(document.getElementById('map'));
    gestures.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    gestures.on('swipeleft', function(ev) {
      map.flyTo({center: overlays.datasources[1].features[i++].geometry.coordinates});
	    //map.panBy([10,0]);
    });

    gestures.on('swiperight', function(ev) {
      map.flyTo({center: overlays.datasources[1].features[i--].geometry.coordinates});
	    //map.panBy([-10,0]);
    });

    gestures.on('swipeup', function(ev) {
	    map.panBy([0,10]);
    });

    gestures.on('swipedown', function(ev) {
	    map.panBy([0,-10]);
    });
    */
  }
}
