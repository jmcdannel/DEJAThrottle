<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { computedAsync } from '@vueuse/core'
  import router from '../router'

  import ThrottleComponent from '@/throttle/Throttle.component.vue'

  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'

  const route = useRoute()
  const { acquireThrottle, releaseThrottle, getLocoByAddress } = useDejaCloud()
  const throttle  = computed(() => route.params.address
    ? acquireThrottle(parseInt(route.params.address?.toString()))
    : null)

  const loco = computedAsync(async () => route.params.address
    ? await getLocoByAddress(parseInt(route.params.address?.toString()))
    : null, null)

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
    <ThrottleComponent :throttle="throttle.value" :loco="loco" @release="handleRelease" />
  </template>
</template>
