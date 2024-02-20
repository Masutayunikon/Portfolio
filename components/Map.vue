<script setup lang="js">

import { Map, MapStyle, config } from '@maptiler/sdk';
import { shallowRef, onMounted, onUnmounted, markRaw } from 'vue';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const mapContainer = shallowRef(null);
const map = shallowRef(null);


let size = 200;

// implementation of CustomLayerInterface to draw a pulsing dot icon on the map
// see https://docs.maptiler.com/sdk-js/api/properties/#customlayerinterface for more info
let pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  // get rendering context for the map canvas when layer is added to the map
  onAdd: function () {
    let canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
  },

  // called once before every frame where the icon will be used
  render: function () {
    let duration = 1000;
    let t = (performance.now() % duration) / duration;

    let radius = (size / 2) * 0.3;
    let outerRadius = (size / 2) * 0.7 * t + radius;
    let context = this.context;

    // draw outer circle
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
    );
    context.fillStyle = 'rgba(93, 0, 138,' + (1 - t) + ')';
    context.fill();

    // draw inner circle
    context.beginPath();
    context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
    );
    context.fillStyle = 'rgb(153,39,166)';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // update this image's data with data from the canvas
    this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
    ).data;

    // continuously repaint the map, resulting in the smooth animation of the dot
    map.value.triggerRepaint();

    // return `true` to let the map know that the image was updated
    return true;
  }
};

onMounted(() => {
  config.apiKey = 'aRM0EsuAOBsiTdVFLlWr';

  map.value = markRaw(new Map({
    container: mapContainer.value,
    style: MapStyle.STREETS,
    center: [14.183286, 57.780103],
    zoom: 12,
    navigationControl: false,
    geolocateControl: false,
    interactive: false,
  }));

  map.value.on('load', () => {
    map.value.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

    map.value.addSource('points', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [14.183286, 57.780103]
            }
          }
        ]
      }
    });
    map.value.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'points',
      'layout': {
        'icon-image': 'pulsing-dot'
      }
    });
  });

})

onUnmounted(() => {
  map.value?.remove();
})

</script>

<template>
  <div class="map rounded-3xl" ref="mapContainer"></div>
</template>

<style scoped lang="scss">

.map {
  width: 100%;
  height: 100%;
}

</style>
