# Overlapping-Avoided Tooltip for Leaflet

This plugin is designed to avoid tooltip overlapping and make users find out the relationship between each tooltip and marker easily. It is based on [Force-Directed Drawing Algorithms](http://cs.brown.edu/people/rtamassi/gdhandbook/chapters/force-directed.pdf) in the chapter 12 of the book Handbook of Graph Drawing and Visualization written by Stephen G. Kobourov.

Here is the [demo](https://zijingpeng.github.io/overlapping-avoided-tooltip/).



## How to use it?

1. Each time when you want to add a marker with a tooltip, you should add `icon: icon` as one option of marker and `tooltipOption` as the option of tooltip. Also, remember to push each marker to a list.

   Usage example:

   ```js
   var marker = L.marker(latlng, {
     icon: icon
   });
   markerList.push(marker);

   layer.bindTooltip("Hello World", tooltipOption);
   ```

2. Use `initialize(map, markerList, onPolylineCreated)` to create the layout. `onPolylineCreated` can be a callback function to define the events and the styles of the lines between markers and tooltips. If you want to use the default lines, just let the parameter as `null`.

   ​



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
