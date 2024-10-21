<script setup lang="ts">

defineProps({
  address: {
    type: Number,
    required: true
  }
})

</script>
<template>
  <header class="p-2 text-lg bg-transparent flex items-center justify-between relative flex-wrap">
    <slot name="prepend"></slot>
    <div class="avatar placeholder">
      <div class="bg-sky-500 text-neutral-content rounded-full w-12">
        <span class="text-2xl bold">{{ address?.toString() || '?' }}</span>
      </div>
    </div>
    <div class="grow-0 sm:grow"></div>
    <slot name="center"></slot>
    <div class="grow md:grow-0"></div>
    <aside>
    <slot name="right"></slot>
    <slot name="append"></slot>
    </aside>
  </header>  
</template>