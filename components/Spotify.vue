<script setup lang="ts">

import { useIntervalFn } from '@vueuse/core'

const { pending, data, error, refresh } = await useFetch('/api/spotify/player');

onMounted(async () => {

  useIntervalFn(() => {
    console.log(`refreshing the data again ${new Date().toISOString()}`)
    refresh() // will call the 'todos' endpoint, just above
  }, 5000)

});

</script>

<template>
  <div class="">
    <div v-if="error" class="flex justify-center items-center">
      <p class="text-base text-red-500">{{ error.message }}</p>
    </div>
    <div v-else class="w-full h-full">
      <div v-if="!data.recentlyPlayed && data.body && data.body.currently_playing_type == 'episode'" class="w-full h-full flex flex-col">
        <div class="w-full h-2/4 flex">
          <div class="w-2/3 h-full">
            <img :src="data.body.item.images[0].url" class="w-full h-full object-cover rounded-3xl"  alt="spotify album cover"/>
          </div>
          <div class="w-1/3 h-1/3">
            <Icon name="logos:spotify-icon" class="text-white ml-5" size="40%"/>
          </div>
        </div>
        <div class="w-full h-1/4 flex flex-col mt-3">
          <p class="text-white text-lg font-bold overflow-hidden text-ellipsis">{{ data.body.item.name }}</p>
          <p class="text-white text-base overflow-hidden text-ellipsis">{{ data.body.item.show[0].name }}</p>
        </div>
      </div>
      <div v-else-if="!data.recentlyPlayed && data.body" class="w-full h-full flex flex-col">
        <div class="w-full h-2/4 flex">
          <div class="w-2/3 h-full">
            <img :src="data.body.item.album.images[0].url" class="w-full h-full object-cover rounded-3xl"  alt="spotify album cover"/>
          </div>
          <div class="w-1/3 h-1/3">
            <Icon name="logos:spotify-icon" class="text-white ml-5" size="40%"/>
          </div>
        </div>
        <div class="w-full h-1/4 flex flex-col mt-3">
          <p class="text-white text-lg font-bold overflow-hidden text-ellipsis">{{ data.body.item.name }}</p>
          <p class="text-white text-base overflow-hidden text-ellipsis">{{ data.body.item.artists[0].name }}</p>
        </div>
      </div>
      <div v-else class="w-full h-full flex flex-col">
        <div class="w-full h-2/4 flex">
          <div class="w-2/3 h-full">
            <img :src="data.body.items[0].track.album.images[0].url" class="w-full h-full object-cover rounded-3xl"  alt="spotify album cover"/>
          </div>
          <div class="w-1/3 h-1/3">
            <Icon name="logos:spotify-icon" class="text-white ml-5" size="40%"/>
          </div>
        </div>
        <div class="w-full h-1/4 flex flex-col mt-3">
          <p class="text-white text-lg font-bold overflow-hidden text-ellipsis">{{ data.body.items[0].track.name }}</p>
          <p class="text-white text-base overflow-hidden text-ellipsis">{{ data.body.items[0].track.artists[0].name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
