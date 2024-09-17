<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useCurrentUser } from 'vuefire'
  import { 
    BsFillLightningCharge,
    BsFillLightningChargeFill,
    BsUsbSymbol,
    BsCloud,
    BsCloudFill,
    BsCpu,
    BsUsbPlug,
    BsUsbPlugFill,
    BsCupHotFill,
    Bs
  } from 'vue3-icons/bs'
  import { BiServer, BiSolidServer } from "vue3-icons/bi"
  import { useConnectionStore } from '@/connections/connectionStore'
  import StatusMenuItem from '@/core/StatusMenu/StatusMenuItem.component.vue'
  import DejaSignout from '@/deja-cloud/DejaSignout.vue'
  import useSerial from '@/api/serialApi'
 
  const serialApi = useSerial()
  const user = useCurrentUser()
  const connStore = useConnectionStore()
  const { layoutId, isEmulated, dejaConnected, serialConnected, cloudConnected } = storeToRefs(connStore)  

  const handleDisconnect = () => {
    connStore.disconnect()
  }

  const handleSerial = () => {
    console.log('handleSerial', serialConnected.value)
    try {
      if (serialConnected.value) {
        serialApi.disconnect()
      } else {
        serialApi.connect()
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleEmulator = () => {
    console.log('handleEmulator', isEmulated.value)
    if (isEmulated.value) {
      connStore.disconnect()
    } else {
      connStore.connect('emulator')
    }
  }

</script>
<template>    
    <main class="py-3 px-4 pb-24 overflow-auto forest-background items-center justify-center">
      <h2 class="mb-4 fancy-title leading-tight text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
        Connect
        Your
        <strong class="text-8xl font-extralight uppercase">Layout</strong>
      </h2>

      <Transition name="slide-out" mode="out-in">
      <div class="stats stats-vertical w-full">
        <StatusMenuItem 
          :icon="BsCloud" 
          :is-connected="(!!user && cloudConnected)"
          item-label="DEJA Cloud" 
          page="deja-cloud"
          @disconnect="handleDisconnect()"
          class="text-pink-400">    
          <VaChip v-if="(!!user && cloudConnected)" @click="$router.push({ name: 'deja-cloud' })" outline :color="cloudConnected ? 'success' : 'gray-500'">{{ layoutId }}</VaChip>
          <template v-if="(!!user && cloudConnected)" v-slot:desc>
            <h3 class="pt-2 text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
              <VaAvatar :size="24" :src="user?.photoURL" />
              {{ user?.displayName }}
            </h3>
            <!-- <p class="py-1">
              Connect DEJA Throttle to a DEJA.js server. The Definitive, Transformative, Innovative DCC-EX CommandStation API. Requires modern Chromium browser.
            </p> -->
          </template>
          <template v-if="(!!user && cloudConnected)" v-slot:actions>
            <DejaSignout />
          </template>
        </StatusMenuItem>
        <StatusMenuItem 
          :icon="BiServer" 
          :is-connected="dejaConnected"
          item-label="DEJA.js" 
          page="dejajs"
          @disconnect="handleDisconnect()"
          class="text-pink-400">    
          {{ dejaConnected ? 'Connected' : '' }}
          <template v-slot:desc>
            <!-- <p class="py-1">
              Connect DEJA Throttle to a DEJA.js server. The Definitive, Transformative, Innovative DCC-EX CommandStation API. Requires modern Chromium browser.
            </p> -->
          </template>
        </StatusMenuItem>
        <StatusMenuItem 
          :icon="BsUsbSymbol" 
          :is-connected="serialConnected"
          item-label="DEJA Direct"  
            @disconnect="handleDisconnect()"
          @connect="handleSerial">    
          {{ serialConnected ? 'Connected' : '' }}
          <template v-slot:desc>
            <!-- <p class="py-1">
              Connect DEJA Throttle to a DCCEX Command Station Arduino connected directly to this computer. Requires modern Chromium browser.
            </p> -->
          </template>
        </StatusMenuItem>
        <StatusMenuItem 
          :icon="BsCupHotFill" 
          :is-connected="isEmulated"
          item-label="DEJA Demo"
          class="text-pink-400"
          @disconnect="handleDisconnect()"
          @connect="handleEmulator">    
          {{ isEmulated ? 'Connected' : '' }}
          <template v-slot:desc>
            <!-- <p class="py-1">
              Emulate a connection to a DCC-EC EX-CommandStation. This connection mode allows you to test the DEJA Throttle without a physical connection to a DCC-EC EX-CommandStation.
            </p> -->
          </template>
        </StatusMenuItem>
      </div>
    </Transition> 
    </main>
</template>

<style scoped>
  .fancy-title {
    word-spacing: 90vw; 
  }

  .slide-out-enter-active, .slide-out-leave-active {
    transition: transform 0.5s;
  }
  .slide-out-enter-active {
    transform: translateX(100%);
  }
  .slide-out-enter-to {
    transform: translateX(0);
  }

  /* @media screen and (max-width: 640px) {
    .fancy-title {
      word-spacing: normal;
    }
  } */
</style>