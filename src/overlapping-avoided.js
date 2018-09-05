// global variables
var markerList = []; // all markers here
var polylineList = []; // all polylines here
var dragOffset = [0, 0];
var tempDrag = [0, 0]

const tooltipOption = {
  classname: 'heading',
  permanent: true,
  interactive: true,
  direction: 'left',
};
var moveOffset = [];

var icon = L.icon({
  iconUrl: 'circle-grey.png',
  iconSize: [10, 10]
});

var iconlarge = L.icon({
  iconUrl: 'circle-red.png',
  iconSize: [14, 14]
});


function clear() {
  markerList = []; // all markers here
  polylineList = [];
}

function initialize(map) {
  // event registrations
  map.on('zoomstart', function () {
    removeAllPolyline(map);
  });

  map.on('zoomend', function () {
    setRandomPos(map);
    layoutByForce();
    setEdgePosition();
    drawLine(map);
  });

  map.on('mousedown', function (event) {
    tempDrag = [event.containerPoint.x, event.containerPoint.y];
  });

  map.on('mouseup', function (event) {
    dragOffset = [dragOffset[0] + event.containerPoint.x - tempDrag[0], dragOffset[1] + event.containerPoint.y - tempDrag[1]];
    console.log(dragOffset);
    removeAllPolyline(map);
    setRandomPos(map);
    layoutByForce();
    setEdgePosition();
    drawLine(map);
  });

  addMarkerHoverEvents();
}

function avoidOverlapping(map) {
  removeAllPolyline(map);
  setRandomPos();
  layoutByForce();
  setEdgePosition();
  drawLine(map);
}


function removeAllPolyline(map) {
  var i;
  for (i = 0; i < polylineList.length; i++) {
    map.removeLayer(polylineList[i]);
  }
  polylineList = [];
}

// mouse hover and icon gets larger
function onMarkerMouseover(marker, tooltipDom) {
  return function () {
    marker.setIcon(iconlarge);
    marker._icon.style.zIndex = 999;
    tooltipDom.style.zIndex = 999;
    tooltipDom.style.border = '2px solid #039BE5';
    marker.ply.setStyle({
      color: '#039BE5'
    });
    console.log(getPosition(marker._icon));
    console.log(getPosition(marker.getTooltip()._container));
    // console.log(map.getBounds());
  };
}

function onMarkerMouseout(marker, tooltipDom) {
  return function () {
    marker.setIcon(icon);
    marker._icon.style.zIndex = '';
    tooltipDom.style.zIndex = '';
    tooltipDom.style.border = '';
    tooltipDom.style.borderColor = '';
    marker.ply.setStyle({
      color: '#90A4AE'
    });
  };
}

function addMarkerHoverEvents() {
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

// end of feature: mouse hover and icon gets larger

/**
 * Draw lines between markers and tooltips
 */
function drawLine(map) {
  removeAllPolyline(map);
  for (var i = 0; i < markerList.length; i++) {
    var marker = markerList[i];
    var markerDom = marker._icon;
    var markerPosition = getPosition(markerDom);
    var label = marker.getTooltip();

    var labelDom = label._container;
    var labelPosition = getPosition(labelDom);

    var x1 = labelPosition.x;
    var y1 = labelPosition.y;

    var x = markerPosition.x;
    var y = markerPosition.y;

    x1 -= 5;
    y1 += 2;
    if (x1 - x !== 0 || y1 - y !== 0) {
      if (x1 + labelDom.offsetWidth < markerPosition.x) {
        x1 += labelDom.offsetWidth;
      }
      if (y1 + labelDom.offsetHeight < markerPosition.y) {
        y1 += labelDom.offsetHeight;
      }
      var lineDest = L.point(x1, y1);
      var destLatLng = map.layerPointToLatLng(lineDest);

      setTimeout(((marker, destLatLng) => () => {
        var ply = L.polyline([marker.getLatLng(), destLatLng], {
          color: '#90A4AE'
        }).addTo(map);
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
        marker.ply = ply;
        polylineList.push(ply);
      })(marker, destLatLng), 0);
    }
  }
}

function setRandomPos() {
  for (var i = 0; i < markerList.length; i++) {
    var marker = markerList[i];
    var label = marker.getTooltip();
    var labelDom = label._container;
    var markerDom = marker._icon;
    var markerPosition = getPosition(markerDom);
    // var angle = Math.floor(Math.random() * 19 + 1) * 2 * Math.PI / 20;
    var angle = 2 * Math.PI / 6 * i;
    var x = markerPosition.x;
    var y = markerPosition.y;
    var dest = L.point(Math.ceil(x + 50 * Math.sin(angle)), Math.ceil(y + 50 * Math.cos(angle)));
    L.DomUtil.setPosition(labelDom, dest);
  }
}

function scaleTo(a, b) {
  return L.point(a.x * b.x, a.y * b.y);
}

function normalize(a) {
  var l = a.distanceTo(L.point(0, 0));
  if (l === 0) {
    return a;
  }
  return L.point(a.x / l, a.y / l);
}

function fa(x, k) {
  return x * x / k;
}

function fr(x, k) {
  return k * k / x;
}

/**
 * get position form el.style.transform
 */
function getPosition(el) {
  var translateString = el.style.transform.split('(')[1].split(')')[0].split(',');
  return L.point(parseInt(translateString[0]), parseInt(translateString[1]));
}

/**
 * t is the temperature in the system
 */
function computePositionStep(t) {
  var area = window.innerWidth * window.innerHeight / 10;
  var k = Math.sqrt(area / markerList.length);
  var dpos = L.point(0, 0);
  var v_pos;
  var v;
  var i;

  for (i = 0; i < markerList.length; i++) {
    v = markerList[i];
    // get position of label v
    v.disp = L.point(0, 0);
    v_pos = getPosition(v.getTooltip()._container);

    // compute gravitational force
    for (var j = 0; j < markerList.length; j++) {
      var u = markerList[j];
      if (i !== j) {
        var u_pos = getPosition(u.getTooltip()._container);
        dpos = v_pos.subtract(u_pos);
        if (dpos !== 0) {
          v.disp = v.disp.add(normalize(dpos).multiplyBy(fr(dpos.distanceTo(L.point(0, 0)), k)));
        }
      }
    }
  }

  // compute force between marker and tooltip
  for (i = 0; i < markerList.length; i++) {
    v = markerList[i];
    v_pos = getPosition(v.getTooltip()._container);
    dpos = v_pos.subtract(getPosition(v._icon));
    v.disp = v.disp.subtract(normalize(dpos).multiplyBy(fa(dpos.distanceTo(L.point(0, 0)), k)));
  }

  // calculate layout
  for (i = 0; i < markerList.length; i++) {
    var disp = markerList[i].disp;
    var p = getPosition(markerList[i].getTooltip()._container);
    var d = scaleTo(normalize(disp), L.point(Math.min(Math.abs(disp.x), t), Math.min(Math.abs(disp.y), t)));
    p = p.add(d);
    p = L.point(Math.ceil(p.x), Math.ceil(p.y));
    L.DomUtil.setTransform(markerList[i].getTooltip()._container, p);
  }
}

function layoutByForce() {
  var start = Math.ceil(window.innerWidth / 10);
  var times = 50;
  var t;
  for (var i = 0; i < times; i += 1) {
    t = start * (1 - i / (times - 1));
    computePositionStep(t);
  }
}

function setEdgePosition() {
  for (i = 0; i < markerList.length; i++) {
    var tooltip = getPosition(markerList[i].getTooltip()._container);
    var marker = getPosition(markerList[i]._icon)
    var width = markerList[i].getTooltip()._container.offsetWidth;
    var height = markerList[i].getTooltip()._container.offsetHeight;

    if (marker.x > -dragOffset[0] && tooltip.x < -dragOffset[0]) {
      tooltip.x = -dragOffset[0];
    } else if (marker.x < window.innerWidth - dragOffset[0] && tooltip.x > window.innerWidth - dragOffset[0] - width) {
      tooltip.x = window.innerWidth - width - dragOffset[0];
    }

    if (marker.y > -dragOffset[1] && tooltip.y < -dragOffset[1]) {
      tooltip.y = -dragOffset[1];
    } else if (marker.y < window.innerHeight - dragOffset[1] && tooltip.y > window.innerHeight - dragOffset[1] - height) {
      tooltip.y = window.innerHeight - height - dragOffset[1];
    }

    L.DomUtil.setTransform(markerList[i].getTooltip()._container, tooltip);
  }
}
