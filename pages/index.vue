<script setup lang="ts">

const photos : Ref<{ file: string, location: string }[]> = ref([
  {
    file: 'GOPR0127.jpg',
    location: 'Stockholm'
  },
  {
    file: 'GOPR0131.jpg',
    location: 'Stockholm'
  },
])


console.log(photos.value)
</script>

<template>
  <main class="flex-col lg:flex-row flex w-full bg-gray-800">
    <div class="lg:w-1/2 w-full flex justify-center flex-col items-center m-2.5 p-5">
      <img src="~/assets/image.jpg" class="p-5 rounded-full w-2/3 max-w-80 max-h-80" alt="profile picture">
      <span class="text-white text-2xl font-bold lg:text-3xl">Quentin ROBERT</span>
      <br>
      <span class="text-white text-lg lg:text-xl text-center">✨ Développeur web en devenir ✨</span>
      <br>
      <span class="text-white text-lg lg:text-xl text-center">🖥️ Étudiant en 4ème année à Epitech</span>
      <br>
      <span class="text-white text-lg lg:text-xl text-center">🎓 Actuellement en échange à l'Université de Jönköping poursuivant un Master en UI/UX</span>
      <br>
      <span class="text-white text-lg lg:text-xl text-center">🌍 Né à La Réunion 🇷🇪 | Passionné par le développement web et la création d'expériences utilisateurs captivantes.</span>
    </div>
    <div class="lg:w-1/2 w-full flex justify-center">
      <div class="bento flex flex-wrap justify-center content-center items-center w-full max-w-lg mt-10 mb-10">
        <div class="big-case bg-gray-950 w-full rounded-3xl mt-1 mb-1 p-5 max-h-full overflow-hidden flex justify-center items-center flex-col">
          <Map />
          <span class="text-white text-2xl font-bold mt-5 ">Actuellement à Jönköping</span>
        </div>
        <div class="small-case bg-gray-950 hover:bg-gray-700 w-full rounded-3xl mt-1 mb-1">
          <a href="https://discordapp.com/users/377097713944231947" target="_blank" class="w-full h-full">
            <Icon name="openmoji:discord" class="text-white" size="100%"/>
          </a>
        </div>
        <div class="small-case bg-gray-950 hover:bg-gray-700 w-full rounded-3xl mt-1 mb-1">
          <a href="https://github.com/Masutayunikon" target="_blank" class="w-full h-full">
            <Icon name="openmoji:github" class="text-white" size="100%"/>
          </a>
        </div>
        <div class="small-case bg-gray-950 hover:bg-gray-700 w-full rounded-3xl mt-1 mb-1">
          <a href="mailto:quentinmail974@gmail.com" class="w-full flex justify-center items-center h-full">
            <Icon name="logos:google-gmail" class="text-white" size="70%"/>
          </a>
        </div>
        <div class="small-case bg-gray-950 hover:bg-gray-700 w-full rounded-3xl mt-1 mb-1">
          <a href="https://www.instagram.com/qu3ntln_/" target="_blank" class="w-full h-full">
            <Icon name="openmoji:instagram" class="text-white" size="100%"/>
          </a>
        </div>
        <div class="medium-case bg-gray-950 w-full rounded-3xl mt-1 mb-1 flex justify-center items-center p-1">
          <span class="text-white text-base font-bold text-center max-h-full overflow-hidden">
             « Explorant les vastes possibilités du web, inspiré par les couleurs et les cultures de mon île natale. »
          </span>
        </div>
        <div class="medium-case bg-gray-950 w-full rounded-3xl mt-1 mb-1 p-4">
          <Spotify class="max-h-full	overflow-hidden"/>
        </div>
      </div>
    </div>
  </main>
  <div class="bg-gray-800 w-full flex items-center max-w-full flex-col">
    <span class="w-full text-white font-bold text-3xl text-center">Visualisation de mon activité sur Wakatime</span>
    <div class="w-full overflow-auto scrollbar-hide m-10 scrollbar-hide">
      <figure class="m-auto"> <embed class="p-10 m-auto" src="https://wakatime.com/share/@Yunikon/dfd132e7-7403-4efa-a581-fcf62a6255b4.svg"/></figure>
    </div>
  </div>
  <div class="bg-gray-800 w-full flex items-center max-w-full flex-col">
    <span class="w-full text-white font-bold text-3xl text-center">Mes dernières activités sur Github</span>
    <GthubFeed class="mt-10"/>
  </div>
  <div class="bg-gray-800 w-full flex items-center max-w-full flex-col">
    <span class="w-full text-white font-bold text-3xl text-center">Mes projets</span>
    <div class="w-full flex justify-center items-center flex-wrap mt-10">
    </div>
  </div>
  <div class="bg-gray-800 w-full flex items-center max-w-full flex-col">
    <span class="w-full text-white font-bold text-3xl text-center">Gallerie de photos</span>
    <div class="w-full flex justify-center items-center flex-wrap mt-10">
      <div v-for="photo in photos" :key="photo" class="max-w-lg max-h-lg aspect-square m-2.5 relative">
        <!-- Span qui s'affiche en bas à droite -->
        <span class="absolute bottom-2 left-2 font-bold p-1.5 rounded-3xl bg-amber-100">{{ photo.location }}</span>

        <img :src="`/photos/${photo.file}`" class="w-full h-full object-cover rounded-3xl" alt="photo"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.bento {

  padding: 2.5%;

  .big-case {
    width: 100%;
    aspect-ratio: 1 / 1;
  }

  .medium-case {
    width: 47.5%;

    &:nth-of-type(6) {
      margin-right: 2.5%;
    }

    &:nth-of-type(7) {
      margin-left: 2.5%;
    }

    aspect-ratio: 1 / 1;
  }

  .small-case {
    width: 47.5%;
    aspect-ratio: 1 / 1;

    &:nth-of-type(2) {
      margin-right: 2.5%;
    }

    &:nth-of-type(3) {
      margin-left: 2.5%;
    }

    &:nth-of-type(4) {
      margin-right: 2.5%;
    }

    &:nth-of-type(5) {
      margin-left: 2.5%;
    }

    @media (min-width: 650px) {
      width: 22%;

      &:nth-of-type(2) {
        margin-right: 2%;
      }

      &:nth-of-type(3) {
        margin-left: 2%;
        margin-right: 2%;
      }

      &:nth-of-type(4) {
        margin-left: 2%;
        margin-right: 2%;
      }

      &:nth-of-type(5) {
        margin-left: 2%;
      }


    }

  }

}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

</style>
