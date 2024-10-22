<script setup lang="ts">
import { useEfx } from '@/api/useEfx'
import EffectItem from '@/effects/Effect.vue'

const emit = defineEmits(['edit'])

const { getEffects } = useEfx()
const list = getEffects()

function handleEdit(item) {
  console.log('handleEdit', item)
  emit('edit', item)
}

</script>
<template>
  <div class="flex flex-col overflow-auto flex-grow w-full">
    <EffectItem v-for="item in list"
      :key="item.id" :efx="item" :efxId="item.id" @edit="handleEdit"></EffectItem>
  </div>
</template>