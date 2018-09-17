import * as L from 'leaflet';
import {
  initialize
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
    markerList.push(marker);
    return marker;
  },
  onEachFeature(feature, layer) {
    const tooltipOption = {
      classname: 'heading',
      permanent: true,
      interactive: true,
      direction: 'left'
    };
    layer.bindTooltip(feature.properties.name, tooltipOption);
    feature.properties.alternates.features.forEach((iter, index) => {
      let name = iter.properties.name + ' ' + index;
      let coord = [iter.geometry.coordinates[1], iter.geometry.coordinates[0]];
      let marker = L.marker(coord, {
        icon: icon
      }).addTo(map);
      marker.bindTooltip(name, tooltipOption);
      markerList.push(marker);
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
      marker.__ply && marker.__ply.setStyle({
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
      marker.__ply && marker.__ply.setStyle({
        color: '#90A4AE'
      });
    };
  }

  var i, marker, tooltip;
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
  ply.on('mouseover', function (e) {
    e.target.setStyle({
      color: '#039BE5'
    });
  });
  ply.on('mouseout', function (e) {
    e.target.setStyle({
      color: '#90A4AE'
    });
  });
}

// init plugin
initialize(map, markerList, onPolylineCreated);
