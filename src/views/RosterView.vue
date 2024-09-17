<script setup lang="ts">
  import { storeToRefs } from 'pinia'

  import Roster from '@/core/Roster.vue'
  import DejaCloudRoster from '@/deja-cloud/DejaCloudRoster.vue'
  import { useConnectionStore } from '@/connections/connectionStore'
  import router from '@/router';
  
  const { cloudConnected } = storeToRefs(useConnectionStore())
  
  const openThrottle = async (address: number) => {
    router.push({ name: 'cloud-throttle', params: { address } })
  }
</script>

<template>
  <h2 class="mt-12 placeholder:font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-300 to-pink-600">
    Select
    Your<br>
    <strong class="text-7xl uppercase">Loco</strong>
  </h2>
  <template v-if="cloudConnected">
    <DejaCloudRoster @selected="openThrottle" />
  </template>
  <template v-else>
    <Roster />
  </template>
</template>
