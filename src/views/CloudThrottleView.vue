<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import router from '../router'

  import ThrottleComponent from '@/throttle/Throttle.component.vue'
  import type { Throttle } from '@/throttle/types'

  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'

  const route = useRoute()
  const { acquireThrottle, releaseThrottle } = useDejaCloud()
  const throttle  = computed(() => route.params.address
    ? acquireThrottle(parseInt(route.params.address?.toString()))
    : null)

  function handleRelease(address) {
    console.log('handleRelease', throttle.value, address)
    if (address) {
      releaseThrottle(address)
      router.push({ name: 'home' })
    }
  }

</script>

<template>
  <template v-if="throttle?.value">
    <ThrottleComponent :throttle="throttle.value" @release="handleRelease" />
  </template>
</template>
