# Overlapping-Avoided Tooltip for Leaflet

This plugin is designed to avoid tooltip overlapping and make users find out the relationship between each tooltip and marker easily. It is based on [Force-Directed Drawing Algorithms](http://cs.brown.edu/people/rtamassi/gdhandbook/chapters/force-directed.pdf) in the chapter 12 of the book Handbook of Graph Drawing and Visualization written by Stephen G. Kobourov.



## How to use it?

1. Add `overlapping-avoided.css`, `normalize.css`, `leaflet.css(version 1.3.4)` and `overlapping-avoided.js`, `leaflet.js(version 1.3.4)` to your code.

2. Use `clear()` to clear the exist markers and tooltips before add new one

3. Each time when you want to add a marker with a tooltip, you should add `icon: icon` as one option of marker and `tooltipOption` as the option of tooltip.

   Usage example:

   ```js
   var marker = L.marker(latlng, {
     icon: icon
   });

   layer.bindTooltip("Hello World", tooltipOption);
   ```

4. Then you can use following functions to show the overlapping-avoided tooltips. 

   | Function           | Description                              |
   | ------------------ | ---------------------------------------- |
   | initialize(map)    | Add several events, including zoom events on the map and mouse events on tooltip and markers. If you have events such as click on the tooltip, you can find the function `addMarkerHoverEvents()` in `overlapping-avoided.js` and add your event to it. |
   | avoidOverlapping(map) | Calculate each position of each tooltip in order to avoid overlapping and draw line between each tooltip and marker. It is designed based on Force-Directed Drawing Algorithms. |



## Build Guide

```shell
git clone git@github.com:ZijingPeng/Overlapping-Avoided-Tooltip-for-Leaflet.git
cd ./Overlapping-Avoided-Tooltip-for-Leaflet

npm i # install dependencies
npm run build # build lib & example

# or
npm run serve # enter dev zone
```



## License

MIT License
