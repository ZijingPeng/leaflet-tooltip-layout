# leaflet-tooltip-layout

This plugin is designed to avoid tooltip overlapping and make users find out the relationship between each tooltip and marker easily. It is based on [Force-Directed Drawing Algorithms](http://cs.brown.edu/people/rtamassi/gdhandbook/chapters/force-directed.pdf) in the chapter 12 of the book Handbook of Graph Drawing and Visualization written by Stephen G. Kobourov.

[Here is the demo](https://zijingpeng.github.io/overlapping-avoided-tooltip/)



## Installation

```shell
npm i leaflet-tooltip-layout --save
# or
yarn add leaflet-tooltip-layout
```

Or you can just copy `./lib/index.js` to your project and rename it to what you want.



## Getting Started

### *ES6*

```js
import * as tooltipLayout from 'leaflet-tooltip-layout';
// or
import { resetMarker, getMarkers, getLine, initialize, getLine } from 'leaflet-tooltip-layout';
```



### *CommonJS*

```js
const tooltipLayout = require('leaflet-tooltip-layout');
```



### *Browser*

Make sure `leaflet` is imported before this plugin, and `window.L` is available

```html
<script type="text/javascript" src="/path/to/leaflet-tooltip-layout.js"></script>
```



## API Reference

1. `L.tooltipLayout.resetMarker(marker)`

   Create the marker, bind tooltip to the marker, then use this function.

   Usage example:

   ```js
   var marker = L.marker(coord, {
     icon: icon
   }).addTo(map);
   marker.bindTooltip('Hello world!');
   L.tooltipLayout.resetMarker(marker);
   ```

2. `L.tooltipLayout.getMarkers()`

   Get the all the markers in this layout.

   Usage example:

   ```js
   var markerList = getMarkers();
   for (i = 0; i < markerList.length; i++) {
     marker = markerList[i];
     tooltip = marker.getTooltip();
     marker._icon.addEventListener('mouseover', function (){
       // your code
     });
     tooltip._container.addEventListener('mouseover', function (){
       // your code
     });
   }
   ```

3. `L.tooltipLayout.getLine(marker)`

   Get the line between one marker and its tooltip.

4. `L.tooltipLayout.initialize(map, onPolylineCreated)`

   After adding all the markers and tooltips, use this function to create the layout.

   `onPolylineCreated` is a callback function that allows you to define the style of the line between markers and tooltips, if you want the default one, let this parameter `null`. 

   Or you can define the function like this:

   ```js
   function onPolylineCreated(ply) {
     ply.setStyle({
       color: '#90A4AE'
     })
   }
   ```



## Build Guide

```shell
git clone git@github.com:ZijingPeng/leaflet-tooltip-layout.git
cd ./leaflet-tooltip-layout

npm i # install dependencies
npm run build # build lib & example

# or
npm run serve # enter dev zone
```



## License

MIT License

