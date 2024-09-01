<script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useConnectionStore } from '@/connections/connectionStore'
  import useDcc from '@/api/dccApi'

  const { dejaConnected, isEmulated, serialConnected, cloudConnected } = storeToRefs(useConnectionStore())
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
    :disabled="!(dejaConnected || isEmulated || serialConnected || cloudConnected)"
    class="btn btn-ghost btn-circle relative"
    :class="{
      'text-gray-500': !(dejaConnected || isEmulated || serialConnected || cloudConnected),
      'text-success': (dejaConnected || isEmulated || serialConnected || cloudConnected) && power,
      'text-error': (dejaConnected || isEmulated || serialConnected || cloudConnected) && !power,  
    }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>
      <span class="w-1 h-1 bg-red-500 rounded-full absolute top-0.5"></span>
    </button>
</template>