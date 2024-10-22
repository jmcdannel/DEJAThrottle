<script setup lang="ts">
import { useTurnouts } from '@/api/useTurnouts'
import Turnout from '@/turnouts/Turnout.vue'

const emit = defineEmits(['edit'])

const { getTurnouts } = useTurnouts()
const list = getTurnouts()

function handleEdit(item) {
  console.log('handleEdit', item)
  emit('edit', item)
}

</script>
<template>
  <div class="flex flex-col overflow-auto flex-grow w-full">
    <Turnout v-for="item in list"
      :key="item.id" :turnout="item" :turnoutId="item?.id" @edit="handleEdit"></Turnout>
  </div>
</template>