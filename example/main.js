import * as L from 'leaflet';
import {
  initialize,
  resetMarker,
  getMarkers,
  getLine
} from '../lib';
import {
  icon,
  iconlarge
} from './Icon';
import testData from './TestData';
import config from './Config';

// initialize map
const mapContainerElId = 'map-container';
let map = L.map(mapContainerElId, {
  zoomSnap: 0.25
}).setView([40.2672, -86.1349], 4);

// background layer
L.tileLayer(config.mapTileLayerUrlTemplate, {
  maxZoom: 18,
  id: 'mapbox.streets'
}).addTo(map);

let markerList = [];

L.geoJSON(testData, {
  pointToLayer: function (feature, latlng) {
    let marker = L.marker(latlng, {
      icon: icon
    });
    return marker;
  },
  onEachFeature(feature, layer) {
    feature.properties.alternates.features.forEach((iter, index) => {
      let name = iter.properties.name + ' ' + index;
      let coord = [iter.geometry.coordinates[1], iter.geometry.coordinates[0]];
      let marker = L.marker(coord, {
        icon: icon
      }).addTo(map);
      marker.bindTooltip(name);
      resetMarker(marker);
    });
  }
}).addTo(map);

// when mouse hover, icon gets larger
function addMarkerHoverEvents() {
  function onMarkerMouseover(marker, tooltipDom) {
    return function () {
      marker.setIcon(iconlarge);
      marker._icon.style.zIndex = 999;
      tooltipDom.style.zIndex = 999;
      tooltipDom.style.border = '2px solid #039BE5';
      getLine(marker) && getLine(marker).setStyle({
        color: '#039BE5'
      });
    };
  }

  function onMarkerMouseout(marker, tooltipDom) {
    return function () {
      marker.setIcon(icon);
      marker._icon.style.zIndex = '';
      tooltipDom.style.zIndex = '';
      tooltipDom.style.border = '';
      tooltipDom.style.borderColor = '';
      getLine(marker) && getLine(marker).setStyle({
        color: '#90A4AE'
      });
    };
  }

  var i, marker, tooltip;
  var markerList = getMarkers();
  for (i = 0; i < markerList.length; i++) {
    marker = markerList[i];
    tooltip = marker.getTooltip();
    marker._icon.addEventListener('mouseover', onMarkerMouseover(marker, tooltip._container));
    marker._icon.addEventListener('mouseout', onMarkerMouseout(marker, tooltip._container));
    tooltip._container.addEventListener('mouseover', onMarkerMouseover(marker, tooltip._container));
    tooltip._container.addEventListener('mouseout', onMarkerMouseout(marker, tooltip._container));
  }
}
addMarkerHoverEvents();

// when trigger HMR, just full reload page because leaflet.js is already init
if (module.hot) {
  module.hot.dispose(() => {
    location.reload();
  });

  module.hot.accept(() => {
    location.reload();
  });
}

function onPolylineCreated(ply) {
  ply.setStyle({
    color: '#90A4AE'
  })
}

// init plugin
initialize(map, onPolylineCreated);
