// Depends on mapbox-gl
// Depends on readJSON
// Depends on addOverlays

readJSON('styles/dark-matter.json').then(completeRelativeUrls).then(instantiateMap);

function instantiateMap(style) {
  var map = new mapboxgl.Map({
    container: 'map',
    style: style,
    hash: true
  });

  var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-right');

  readJSON('styles/infra.json').then(completeRelativeUrls).then(addStyle(map)).then(addInfraInteraction);
  readJSON('styles/xarxa-metro.json').then(completeRelativeUrls).then(addStyle(map)).then(addXarxaInteraction);

  function addInfraInteraction(infraStyle) {
    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, {layers: ['infra', 'estacions']});
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

    map.on('click', function (e) {
      var elements = map.queryRenderedFeatures(e.point, {layers: ['infra']});
      if (elements.length) {
        map.flyTo({center: e.lngLat});
        var html = elements.map(function (elements) {
          return JSON.stringify(elements.properties, null, 2);
        }).join("<br/>");
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML("<pre>"+html+"</pre>").addTo(map);
      }
    });
  }

  function addXarxaInteraction(metroStyle) {
    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, {layers: ['estacions', 'infra']});
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

    map.on('click', function (e) {
      var estacions = map.queryRenderedFeatures(e.point, {layers: ['estacions']});
      if (estacions.length) {
        map.flyTo({center: estacions[0].geometry.coordinates, zoom: 17});
        //map.zoomTo(16);
        /*
        var html = estacions.map(function (estacio) {
          return estacio.properties.NOM_LINIA + " - " + estacio.properties.NOM_ESTACIO;
        }).join("<br/>");
        new mapboxgl.Popup().setLngLat(estacions[0].geometry.coordinates).setHTML(html).addTo(map);
        */
      }
    });

    /*
    map['dragPan'].disable();
    var i=0;
    var gestures = new Hammer(document.getElementById('map'));
    gestures.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    gestures.on('swipeleft', function(ev) {
      map.flyTo({center: metroStyle.sources.estacions.data.features[i++].geometry.coordinates});
	    //map.panBy([10,0]);
    });

    gestures.on('swiperight', function(ev) {
      map.flyTo({center: metroStyle.sources.estacions.data.features[i--].geometry.coordinates});
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
