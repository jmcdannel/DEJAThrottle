<script setup>
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useWakeLock } from '@vueuse/core'
  import { useConnectionStore } from '@/connections/connectionStore'
  import { useDcc } from '@/api/dccApi'

  const { isSupported, isActive, request, release } = useWakeLock()

  const DEFAULT_ON = '1 MAIN'
  const DEFAULT_OFF = '0'

  const {
    isEmulated,
    isSerial,
    dccExConnected
   } = storeToRefs(useConnectionStore())
  const dccApi = useDcc()
  const power = ref(null)
  const enabled = computed(() => dccExConnected || isEmulated || isSerial)

  watch(power, async (newPower) => {
    console.log('power', newPower)

    await dccApi.setPower(newPower ? DEFAULT_ON : DEFAULT_OFF)

    if (newPower && isSupported.value && !isActive.value) {
        console.log('locking screen')
        await request('screen')
      } else if (!newPower && isActive.value) {
        console.log('unlocking screen')
        await release()
      } else {
        console.log('screen lock noop', isSupported.value, isActive.value)
      }
  })

</script>
<template>
  <button @click="power = !power"
    :disabled="!enabled"
    class="btn btn-ghost btn-circle relative"
    :class="{
      'text-gray-500': !enabled || power === null,
      'text-success': enabled && power,
      'text-error': enabled && !power,  
    }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>
      <span 
        class="w-1 h-1 rounded-full absolute -top-1"
        :class="{
          'bg-gray-500 animate-bounce': !enabled || power === null,
          'bg-success animate-ping': enabled && power,
          'bg-error': enabled && !power,  
        }"
      ></span>
    </button>
</template>