<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useConnectionStore } from '@/connections/connectionStore.jsx'
  import DejaThrottleBottomNav from '@/deja-cloud/DejaThrottleBottomNav.vue'
  import { 
    IoIosCog,
  } from "vue3-icons/io";
  import { AiFillControl } from "vue3-icons/ai";

  
  const { cloudConnected } = storeToRefs(useConnectionStore())
</script>
<template>
  <footer class="relative">
    <div class="btm-nav max-w-screen-md mx-auto">
      <router-link
        :to="`/`"
        custom
        v-slot="{ navigate }"
      >
        <button class="text-primary" :class="{ active: ($route?.name === 'home' || $route?.name === 'throttle') }" @click="navigate" role="link">
          <AiFillControl  class="w-6 h-6" />
        </button>
      </router-link>
      <DejaThrottleBottomNav v-if="cloudConnected" />
      <router-link
        :to="`/connect`"
        custom
        v-slot="{ navigate }"
      >
        <button class="text-primary" :class="{ active: ($route?.name === 'connect') }" @click="navigate" role="link">
          <IoIosCog  class="w-6 h-6" />
        </button>
      </router-link>
    </div>
  </footer>
</template>