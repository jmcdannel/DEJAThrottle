<script setup lang="ts">

defineProps({
  address: {
    type: Number,
    required: true
  }
})

</script>
<template>
  <header class="p-2 text-lg bg-transparent flex items-center justify-between relative">
    <div class="avatar placeholder">
      <div class="bg-sky-500 text-neutral-content rounded-full w-12">
        <span class="text-2xl bold">{{ address?.toString() || '?' }}</span>
      </div>
    </div>
    <slot name="right"></slot>
  </header>  
</template>