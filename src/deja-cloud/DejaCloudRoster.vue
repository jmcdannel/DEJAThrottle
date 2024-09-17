<script setup lang="ts">
import { ref } from 'vue';
import { useDejaCloud } from '@/deja-cloud/useDejaCloud'
import { VaAvatar } from 'vuestic-ui';

defineProps({
  allowAdd: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['selected'])
const { createLoco, getLocos } = useDejaCloud()
const address = ref(null)
const name = ref(null)
const locos = getLocos()

async function handleAdd() {
  const newAddress = parseInt(address.value as unknown as string) 
  if (!!newAddress) {
    await createLoco(newAddress, name.value as unknown as string)
  }
  emit('selected', address.value)
}

</script>

<template>
  <main class="py-4 grid grid-cols-1 gap-4 md:grid-cols-2">
    <article class="">
      <button v-for="loco in locos" :key="loco.id" class="btn btn-md btn-outline bg-indigo-950 bg-opacity-30 hover:bg-indigo-950 hover:bg-opacity-60 hover:text-primary hover:border-cyan-900 border-primary text-primary w-full my-1"
        @click="$emit('selected', loco.locoId)" 
        role="link">          
        <VaAvatar :size="24">{{  loco.locoId }}</VaAvatar>
        {{ loco?.name || loco?.locoId }}
        <VaAvatar v-for="cloco in loco.consist" :key="cloco.address" :size="24" color="secondary">{{  cloco.address }}</VaAvatar>
      </button>
    </article>
    <aside v-if="allowAdd">
      <form class="border border-red-600 rounded-xl border-opacity-40 p-6 bg-gray-950 bg-opacity-60">
        <legend class="p-2 text-xl text-primary">New Loco</legend>
        <div class="p-2 flex flex-row items-center">
          <input v-model="name" placeholder="Name" class="input input-bordered w-64 max-w-xs" >
        </div>
        <div class="p-2 flex flex-row items-center">
          <input v-model="address" placeholder="DCC Address" class="input input-bordered w-36 max-w-xs" pattern="[0-9]*" inputmode="numeric">
          <button @click="handleAdd" class="ml-4 btn btn-primary w-24">Add</button>
        </div>
      </form>
    </aside>
  </main>
</template>
