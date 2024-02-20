<template>
  <div v-if="error">

  </div>
  <div v-else-if="data && data.body != null" class="flow-root p-5">
      <ul role="list" class="-mb-8">
        <li v-for="(event, eventIdx) in timeline" :key="event.id">
          <div class="relative pb-8">
            <span v-if="eventIdx !== timeline.length - 1" class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
            <div class="relative flex space-x-3">
              <div>
              <span :class="[event.iconBackground]" class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-gray-700">
                <Icon :name="event.icon" class="h-5 w-5 text-white" />
              </span>
              </div>
              <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                <div>
                  <p class="text-sm text-white">
                    {{ event.content }} <a :href="event.href" class="font-medium text-blue-400">{{ event.target }}</a>
                  </p>
                </div>
                <div class="whitespace-nowrap text-right text-sm text-gray-300">
                  <time :datetime="event.datetime">{{ event.date }}</time>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
  </div>
</template>

<script setup>
const { pending, data, error, refresh } = await useFetch('/api/github/events');

const timeline = ref([])


const symbols = {
  PushEvent: 'octicon:commit-24',
  PullRequestEvent: 'octicon:git-pull-request-24',
  ReleaseEvent: 'octicon:tag-24',
  WatchEvent: 'octicon:eye-24',
  CreateEvent: 'octicon:git-branch-24',
  DeleteEvent: 'octicon:trash-24',
  ForkEvent: 'octicon:repo-forked-24',
}

const eventColor = {
  PushEvent: 'bg-green-700', // Vert, bon pour les actions positives
  PullRequestEvent: 'bg-indigo-700', // Indigo, se distingue bien du bleu et ajoute de la variété
  ReleaseEvent: 'bg-orange-700', // Orange, alternative au jaune pour une meilleure visibilité
  WatchEvent: 'bg-teal-700', // Teal, pour diversifier sans perdre l'impact visuel
  CreateEvent: 'bg-purple-700', // Violet, pour la création, indique quelque chose de nouveau
  DeleteEvent: 'bg-red-700', // Rouge, classique pour les suppressions ou alertes
  ForkEvent: 'bg-pink-700', // Rose, pour ajouter une couleur distinctive aux forks
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const getFeedItem = async (event) => {
  const date = formatDate(event.created_at)
  const iconBackground = eventColor[event.type]
  const icon = symbols[event.type]

  let content = ''
  if (event.type === 'PushEvent') {
    content = `${event.actor.login} a commit sur le repository`
  } else if (event.type === 'PullRequestEvent') {
    content = `${event.actor.login} a ouvert une pull request sur le repository`
  } else if (event.type === 'ReleaseEvent') {
    content = `${event.actor.login} a publié une release sur le repository`
  } else if (event.type === 'WatchEvent') {
    content = `${event.actor.login} a commencé à suivre le repository`
  } else if (event.type === 'CreateEvent') {
    if (event.payload.ref_type === 'branch') {
      content = `${event.actor.login} a créé une branche sur le repository`
    } else if (event.payload.ref_type === 'tag') {
      content = `${event.actor.login} a créé un tag sur le repository`
    } else {
      content = `${event.actor.login} a créé un repository`
    }
  } else if (event.type === 'DeleteEvent') {
    if (event.payload.ref_type === 'branch') {
      content = `${event.actor.login} a supprimé une branche sur le repository`
    } else if (event.payload.ref_type === 'tag') {
      content = `${event.actor.login} a supprimé un tag sur le repository`
    } else {
      content = `${event.actor.login} a supprimé un repository`
    }
  } else if (event.type === 'ForkEvent') {
    content = `${event.actor.login} a forké le repository`
  }


  // remove the login name in the target
  const target = event.repo.name.split('/')[1]

  const href = event.href

  return { date, iconBackground, icon, content, target, href }
}

if (data.value && data.value.body != null) {
  for (const event of data.value.body) {
    timeline.value.push(await getFeedItem(event));
  }
}


</script>

<style scoped lang="scss">

</style>
