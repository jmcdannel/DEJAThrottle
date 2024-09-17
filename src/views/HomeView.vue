<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import {
    BsCloudFill,
    BsCpu,
  } from 'vue3-icons/bs'
  import { useCurrentUser } from 'vuefire'
  import { useConnectionStore } from '@/connections/connectionStore.jsx'
  import RosterView from '../views/RosterView.vue'

  const user = useCurrentUser()
  const { dejaConnected, isEmulated, serialConnected, cloudConnected } = storeToRefs(useConnectionStore())

</script>
<template>
  <main class="flex flex-col p-8 w-full viaduct-background  bg-opacity-50 bg-fixed overflow-auto">
    <template v-if="dejaConnected || isEmulated || serialConnected || cloudConnected">
      <h2 v-if="cloudConnected" class="text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600 my-4">
          <VaAvatar :size="48" :src="user?.photoURL" />
          Welcome, {{ user?.displayName }}
      </h2>
      <RosterView />
    </template>
    <template v-else>
      <h2 class="text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600 my-4">
          <VaAvatar :size="48"></VaAvatar>
          Welcome to <strong class="font-extralight uppercase">Deja</strong> Throttle
      </h2>  
      <section class="mt-12">
        <button @click="$router.push({ name: 'deja-cloud' })" class="btn btn-lg btn-outline btn-primary w-full" >
          Connect to DEJA Cloud <BsCloudFill class="h-8 w-8 stroke-none text-primary" />
        </button>
        <p class="text-center my-8">OR</p>
        <button @click="$router.push({ name: 'connect' })" class="btn btn-lg btn-secondary btn-outline w-full">
          View Connection Options <BsCpu class="h-8 w-8 stroke-none text-secondary" />
        </button>
      </section>

    </template>
  </main>
</template>