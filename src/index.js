// Initialize map
var map = L.map('map-container', {
  zoomSnap: 0.25
}).setView([40.2672, -86.1349], 4);

// background and copyrights
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);

clear();

L.geoJSON(testData, {
  pointToLayer: function(feature, latlng) {
    var marker = L.marker(latlng, {
      icon: icon
    });
    markerList.push(marker);
    return marker;
  },
  onEachFeature: onEachFeature
}).addTo(map);

function onEachFeature(feature, layer) {
  layer.bindTooltip(feature.properties.name, tooltipOption);

  feature.properties.alternates.features.forEach((iter, index) => {
    var name = iter.properties.name + ' ' + index;
    var coord = [iter.geometry.coordinates[1], iter.geometry.coordinates[0]];
    var marker = L.marker(coord, { icon: icon }).addTo(map);
    marker.bindTooltip(name, tooltipOption);
    markerList.push(marker);
  });
}


initialize(map);
avoidOverlapping(map);
