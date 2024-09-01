<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import {  useCurrentUser } from 'vuefire'
  import { 
    BsCloud,
    BsCloudFill,
  } from 'vue3-icons/bs'
  import DejaCloudLayoutList from '@/deja-cloud/DejaCloudLayoutList.vue'
  import DejaLogin from '@/deja-cloud/DejaLogin.vue'
  import useDcc from '@/api/dccApi'
  import router from '@/router'
  import tttButton from '@/shared/ui/tttButton.component.vue'
  import { useConnectionStore } from '@/connections/connectionStore.jsx'
  import { useDejaCloud } from "@/deja-cloud/useDejaCloud.js"
  import closeIconSvg from '@/assets/icons/close.svg'
  
  const user = useCurrentUser()
  const conn = useConnectionStore()
  const dejaCloud = useDejaCloud()
  const { layoutId, cloudConnected } = storeToRefs(conn)

  const handleCancelClick = () => {
    router.push({ name: 'home' })
  }

  const handleLayoutClick = async (_layout) => {
    console.log('handleLayoutClick', _layout?.layoutId)
    dejaCloud.send({ action: 'status', payload: { layoutId: _layout?.layoutId }})
    conn.connect('cloud', _layout?.layoutId)
  }

  const handleDisconnectClick = () => {
    conn.disconnect()
    router.push({ name: 'home' })
  }

  const clearLayout = (e:any) => {
    e.preventDefault()
    conn.disconnect()
  }

</script>

<template>
  <main class="p-4 flex flex-col justify-between w-full overflow-auto forest-background">
    <header>
      <h1 class="fancy-title leading-tight text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">Connect</h1>
      <h2 class="text-3xl flex items-end ">
       <span class="bg-clip-text bg-gradient-to-r from-red-800 to-fuchsia-700 font-extrabold">
          DEJA Cloud
        </span>
      </h2>
    </header>
    <main class="my-1 pt-2 flex-grow flex flex-col">  
      <template v-if="user && layoutId">
        <h1 class="text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">Selected Layout:</h1>
        <h2 class="text-5xl flex items-end ">
          <span class="bg-clip-text bg-gradient-to-r from-red-800 to-fuchsia-700 font-extrabold">
            {{ layoutId}}            
            <button class="btn btn-circle btn-outline text-white btn-xs bg-gray-200 border-gray-200" @click="clearLayout">
              <img :src="closeIconSvg" alt="clear layout"  class="h-3 w-3" />
            </button>
          </span>
        </h2>
        <h3 class="text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
          <VaAvatar :size="48" :src="user?.photoURL" />
          Welcome, {{ user?.displayName }}
        </h3>
        <div className="divider"></div>
        <div v-if="cloudConnected" class="text-green-500 text-center flex items-center justify-center">
          <BsCloudFill class="w-24 h-24" />
        </div>
      </template>
      <div v-else class="p-2 flex flex-col items-center justify-center">
        <DejaCloudLayoutList v-if="user" @selectLayout="handleLayoutClick" />
        <DejaLogin v-else />
      </div>
      <div class="flex-grow flex justify-between items-end">
        <tttButton variant="warning" size="lg" @click="handleCancelClick">Cancel</tttButton>
        <tttButton v-if="layoutId" variant="error" size="lg" @click="handleDisconnectClick">Disconnect</tttButton>
      </div>
    </main>
  </main>
</template>