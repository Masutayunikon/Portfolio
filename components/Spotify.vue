<script setup lang="ts">

import { useIntervalFn } from '@vueuse/core';

import ColorThief from "colorthief/dist/color-thief.modern.mjs";

const { pending, data, error, refresh } = await useFetch('/api/spotify/player');

const spotifyWidget : Ref<HTMLElement | null> = ref(null)

const linearGradient = ref('linear-gradient(to bottom right, #1f2937, #1f2937)')
const linearGradientBefore = ref('linear-gradient(to bottom right, #1f2937, #1f2937)')

const opacityBefore = ref(0)

const imgUrl = ref('')

const isBefore = ref(true)

const changeGradient = () => {

  if (data.value && data.value.body) {

    const imageUrl = (!data.value.recentlyPlayed) ? data.value.body.item.album.images[0].url : data.value.body.items[0].track.album.images[0].url

    const colorThief = new ColorThief();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    imgUrl.value = imageUrl

    img.onload = () => {
      const color = colorThief.getPalette(img, 2);

      if (spotifyWidget.value != null) {

        if (isBefore.value) {
          linearGradientBefore.value = `linear-gradient(to bottom right, rgb(${color[0][0]}, ${color[0][1]}, ${color[0][2]}), rgb(${color[1][0]}, ${color[1][1]}, ${color[1][2]}))`
          opacityBefore.value = 1
        } else {
          linearGradient.value = `linear-gradient(to bottom right, rgb(${color[0][0]}, ${color[0][1]}, ${color[0][2]}), rgb(${color[1][0]}, ${color[1][1]}, ${color[1][2]}))`
          opacityBefore.value = 0
        }

        isBefore.value = !isBefore.value

        spotifyWidget.value.style.setProperty('--before-gradient', linearGradientBefore.value)
        spotifyWidget.value.style.setProperty('--after-gradient', linearGradient.value)
        spotifyWidget.value.style.setProperty('--before-opacity', opacityBefore.value.toString())

      }
    }
  }
}

onMounted(async () => {

  changeGradient()

  useIntervalFn(async () => {

    await refresh() // will call the 'todos' endpoint, just above

    changeGradient();

  }, 5000)

});

</script>

<template>
  <div class="">
    <div v-if="error" class="flex justify-center items-center">
      <p class="text-base text-red-500">{{ error.message }}</p>
    </div>
    <div ref="spotifyWidget" v-else id="spotify-widget"
         class="w-full relative h-full p-4 rounded-3xl before:rounded-3xl ">
      <div v-if="!data.recentlyPlayed && data.body && data.body.currently_playing_type == 'episode'" class="w-full h-full flex flex-col">
        <div class="w-full h-3/4 flex">
          <div class="w-2/3 h-full">
            <div class="cover w-full h-full rounded-3xl" :style="{ backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"/>
          </div>
          <div class="w-1/3 h-2/3">
            <Icon name="logos:spotify-icon" class="text-white ml-5" size="40%"/>
          </div>
        </div>
        <div class="w-full h-1/4 flex flex-col mt-3">
          <p class="text-white text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">{{ data.body.item.name }}</p>
          <p class="text-white text-base overflow-hidden text-ellipsis whitespace-nowrap">{{ data.body.item.show[0].name }}</p>
        </div>
      </div>
      <div v-else-if="!data.recentlyPlayed && data.body" class="w-full h-full flex flex-col">
        <div class="w-full h-3/4 flex">
          <div class="w-2/3 h-full">
            <div class="cover w-full h-full rounded-3xl" :style="{ backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"></div>
          </div>
          <div class="w-1/3 h-2/4">
            <Icon name="logos:spotify-icon" class="text-white ml-5" size="40%"/>
          </div>
        </div>
        <div class="w-full h-1/4 flex flex-col mt-3">
          <p class="text-white text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">{{ data.body.item.name }}</p>
          <p class="text-white text-base overflow-hidden text-ellipsis whitespace-nowrap">{{ data.body.item.artists[0].name }}</p>
        </div>
      </div>
      <div v-else class="w-full h-full flex flex-col">
        <div class="w-full h-3/4 flex">
          <div class="w-2/3 h-full">
            <div class="cover w-full h-full rounded-3xl" :style="{ backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"></div>
          </div>
          <div class="w-1/3 h-2/3">
            <Icon name="logos:spotify-icon" class="text-white ml-5" size="40%"/>
          </div>
        </div>
        <div class="w-full h-1/4 flex flex-col mt-3">
          <p class="text-white text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">{{ data.body.items[0].track.name }}</p>
          <p class="text-white text-base overflow-hidden text-ellipsis whitespace-nowrap">{{ data.body.items[0].track.artists[0].name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

#spotify-widget {

  position: relative;

  --before-opacity: 0;
  --after-opacity: 1;
  --before-gradient: linear-gradient(to bottom right, #1f2937, #1f2937);
  --after-gradient: linear-gradient(to bottom right, #1f2937, #1f2937);

  background: var(--after-gradient);


  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--before-gradient);
    opacity: var(--before-opacity);
    transition: opacity 2s ease-in-out;
  }

  .cover {
    transition: background-image 2s ease-in-out;
  }

  div > * {
    position: relative;
    z-index: 1;
  }

}

</style>
