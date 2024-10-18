<script setup lang="ts">
  import { 
    IoIosCog,
  } from "vue3-icons/io";
  import { AiFillControl } from "vue3-icons/ai";

</script>
<template>
  <footer class="relative">
    <div class="btm-nav mx-auto">
      <router-link
        :to="`/`"
        custom
        v-slot="{ navigate }"
      >
        <button class="text-primary" :class="{ active: ($route?.name === 'home' || $route?.name === 'throttle') }" @click="navigate" role="link">
          <AiFillControl  class="w-6 h-6" />
        </button>
      </router-link>
      <slot></slot>
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