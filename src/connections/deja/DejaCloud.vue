<script setup lang="ts">
  import { computed, watch, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import {  useCurrentUser, useDocument } from 'vuefire'
  import { 
    BsCloud,
    BsCloudFill,
  } from 'vue3-icons/bs'
import { FaUsb, FaCloud, FaPowerOff } from 'vue3-icons/fa6'
  import {
    doc,
  } from "firebase/firestore"
  import { db } from "@/firebase"
  import DejaCloudLayoutList from '@/deja-cloud/DejaCloudLayoutList.vue'
  import DejaLogin from '@/deja-cloud/DejaLogin.vue'
  import useDcc from '@/api/dccApi'
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import router from '@/router'
  import tttButton from '@/shared/ui/tttButton.component.vue'
  import { useConnectionStore } from '@/connections/connectionStore.jsx'
  import { useDejaCloud } from "@/deja-cloud/useDejaCloud.js"
  import closeIconSvg from '@/assets/icons/close.svg'
  
  const user = useCurrentUser()
  const conn = useConnectionStore()
  const dejaCloud = useDejaCloud()
  const { layoutId, cloudConnected, dccExConnected } = storeToRefs(conn)

  dayjs.extend(relativeTime)

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


  const layoutDoc = computed(() => layoutId.value 
    ? doc(db, "layouts", layoutId.value) 
    : null)
    
  const layout = useDocument(layoutDoc)

  const lastUpdated = computed(() => layout?.value?.dccEx.timestamp.seconds)

  // watch(layout?.data?.dccEx.timestamp, (newVal, oldVal) => {
  //   console.log('layout updated', newVal, oldVal)
  // })
  watch(lastUpdated, (newVal, oldVal) => {
    const now = dayjs()
    const updated = dayjs.unix(newVal)
    if (!dccExConnected.value && now.diff(updated, 'minute') < 2) {
      console.log('layout updated', now.diff(updated, 'minute'), now.diff(updated, 'second'), now.diff(updated))
      conn.connectDccEx()
    }
  })
  
</script>

<template>
  <main class="p-4 flex flex-col justify-between w-full overflow-auto forest-background">
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
        <div v-if="dccExConnected" class="text-green-500 text-center flex items-center justify-center">
          <FaUsb class="w-24 h-24" />
        </div>
        <div v-else class="text-red-500 text-center flex items-center justify-center">
          <FaUsb class="w-24 h-24" />
        </div>
        <template v-if="layout">
          <article class="px-4 py-4 flex flex-wrap gap-2 items-center relative" >
            <div class="flex-grow relative">

              <FaUsb class="w-12 h-12 text-green-500 absolute right-2 top-2" />
              <pre class="bg-black text-green-300 p-2 rounded-md text-xs bg-opacity-40 border border-slate-500 pr-16">
    {{ layout.dccEx.LCD2 }}
    {{ layout.dccEx.LCD3 }}
    &gt; <span class="blink">_</span>
              </pre>
            </div>
          
            <div class="flex flex-col">
              <div class="flex py-1 min-w-48 justify-between bg-purple-500 border-purple-500 border my-1 items-center py-1 px-2 rounded-full bg-opacity-20"> 
                <VaAvatar class="bg-red-500" size="small">A</VaAvatar>
                <h3>{{ layout.dccEx.trackA }}</h3>
                <VaAvatar class="bg-transparent text-red-500" size="small"><FaPowerOff /></VaAvatar>
              </div>
              <div class="flex py-1 min-w-48 justify-between bg-purple-500 border-purple-500 border my-1 items-center py-1 px-2 rounded-full bg-opacity-20"> 
                <VaAvatar class="bg-red-500" size="small">A</VaAvatar>
                <h3>{{ layout.dccEx.trackB }}</h3>
                <VaAvatar class="bg-transparent text-red-500" size="small"><FaPowerOff /></VaAvatar>
              </div>
              <div>
                <p class="py-2 text-xs text-cyan-200">Updated: {{ dayjs.unix(layout.dccEx.timestamp.seconds).fromNow() }}</p>
              </div>
            </div>
          </article>
          <p class="px-4 text-xs text-cyan-200" v-if="layout">
            {{layout.dccEx.version}}
          </p>
          <pre>{{ layout }}</pre>
        </template>
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