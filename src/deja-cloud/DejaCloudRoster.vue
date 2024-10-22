<script setup lang="ts">
import { ref } from 'vue'
import { VaAvatar } from 'vuestic-ui';
  import router from '@/router'
import { useLocos } from '@/api/useLocos'
import { useThrottle } from '@/throttle/useThrottle'

defineProps({
  allowAdd: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['selected'])
const { getLocos, createLoco } = useLocos()
const { acquireThrottle } = useThrottle()
const address = ref(null)
const name = ref(null)
const locos = getLocos()

async function handleThrottle(address: number) {
  emit('selected', address) 
  const throttle = await acquireThrottle(address)
  console.log('openThrottle', throttle)
  router.push({ name: 'cloud-throttle', params: { address } })
}

async function handleAdd() {
  const newAddress = parseInt(address.value as unknown as string) 
  if (!!newAddress) {
    await createLoco(newAddress, name.value as unknown as string)
  }
  // emit('selected', address.value)
}

</script>

<template>
  <main class="py-4 grid grid-cols-1 gap-4 md:grid-cols-2">
    <article class="">
      <button 
        v-for="loco in locos" 
        :key="loco.locoId" 
        class="
          btn 
          btn-md 
          btn-outline 
          flex
          justify-between
          bg-indigo-950 
          bg-opacity-30 
          border-primary 
          text-primary 
          w-full 
          my-1
          hover:bg-indigo-950 
          hover:border-cyan-900
          hover:bg-opacity-60 
          hover:text-primary 
        "
        @click="handleThrottle(loco.locoId)" 
        role="link">     
        
        <span><VaAvatar :size="24" class="mr-2">{{  loco.locoId }}</VaAvatar>
          {{ loco?.name || loco?.locoId }}
        </span>
        <span><VaAvatar v-for="cloco in loco.consist" :key="cloco.address" :size="18" color="secondary" class="opacity-70">{{  cloco.address }}</VaAvatar></span>
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
