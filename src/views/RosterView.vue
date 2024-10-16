<script setup lang="ts">
  import { useCurrentUser } from 'vuefire'
  import Roster from '@/core/Roster.vue'
  import DejaCloudRoster from '@/deja-cloud/DejaCloudRoster.vue'
  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'
  import router from '@/router';
  
  const { acquireThrottle } = useDejaCloud()
  const user = useCurrentUser()
  
  const openThrottle = async (address: number) => {
    console.log('openThrottle', address)
    const throttle = await acquireThrottle(address)
    console.log('openThrottle', throttle)
    // router.push({ name: 'cloud-throttle', params: { address } })
  }
</script>

<template>
  <h2 class="mt-12 placeholder:font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-300 to-pink-600">
    Select
    Your<br>
    <strong class="text-7xl uppercase">Loco</strong>
  </h2>
  <template v-if="user">
    <DejaCloudRoster @selected="openThrottle" />
  </template>
  <template v-else>
    <Roster />
  </template>
</template>
