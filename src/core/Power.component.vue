<script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
import { useCurrentUser } from 'vuefire'
  import { useConnectionStore } from '@/connections/connectionStore'
  import useDcc from '@/api/dccApi'

  const user = useCurrentUser()
  const {
    isDejaJS,
    isDejaServer,
    isEmulated,
    isSerial,
    dccExConnected
   } = storeToRefs(useConnectionStore())
  const dccApi = useDcc()
  const power = ref(false)

  async function handlePower() {
    try {
      await dccApi.setPower(power.value ? 0 : '1 MAIN');
      power.value = !power.value;
    } catch (err) {
      console.error(err);
    }
  }
</script>
<template>
  <button @click="handlePower"
    :disabled="!(dccExConnected || isEmulated || isSerial)"
    class="btn btn-ghost btn-circle relative"
    :class="{
      'text-gray-500': !(dccExConnected || isEmulated || isSerial),
      'text-success': (dccExConnected || isEmulated || isSerial) && power,
      'text-error': (dccExConnected || isEmulated || isSerial) && !power,  
    }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>
      <span class="w-1 h-1 bg-red-500 rounded-full absolute top-0.5"></span>
    </button>
</template>