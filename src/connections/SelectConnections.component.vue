<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useCurrentUser } from 'vuefire'
  import { useModal, useToast } from 'vuestic-ui'

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
  import router from '@/router' 
 
  const { confirm } = useModal()
  const { init } = useToast()
  const serialApi = useSerial()
  const user = useCurrentUser()
  const connStore = useConnectionStore()
  const { 
    layoutId, 
    isEmulated, 
    isSerial,
    isDejaJS,
    isDejaServer
  } = storeToRefs(connStore)  

  function handleDisconnect() {
    connStore.disconnect()
  }

  function handleSerial() {
    console.log('handleSerial', isSerial.value)
    try {
      if (isSerial.value) {
        serialApi.disconnect()
      } else {
        serialApi.connect()
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleEmulator() {
    console.log('handleEmulator', isEmulated.value)
    if (isEmulated.value) {
      connStore.disconnect()
    } else {
      connStore.connect('emulator')
    }
  }

  async function handleDejaServer() {
    console.log('handleDejaServer', isDejaServer.value, !!user.value, user)
    if (!!user.value) {
      router.push({ name: 'deja-server' })
    } else {
      console.log('login to deja cloud first')
      const result = await confirm({
        message: 'You must login to Deja Cloud first.',
        title: 'DEJA Cloud',
        okText: "Login",
        cancelText: "Cancel",
      })

      if (result) {
        router.push({ name: 'deja-cloud' })
      } else {
        init('DEJA Server Cancelled')
      }
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
          :is-connected="(!!user)"
          item-label="DEJA Cloud" 
          page="deja-cloud"
          @disconnect="handleDisconnect()">    
          <template v-if="(!!user)" v-slot:desc>
            <h3 class="pt-2 text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
              <VaAvatar :size="24" :src="user?.photoURL" />
              {{ user?.displayName }}
            </h3>
            <!-- <p class="py-1">
              Connect DEJA Throttle to a DEJA.js server. The Definitive, Transformative, Innovative DCC-EX CommandStation API. Requires modern Chromium browser.
            </p> -->
          </template>
          <template v-slot:actions>
            <DejaSignout v-if="(!!user)" />
            <template v-else>
              <button @click="$router.push({ name: 'deja-cloud' })" class="btn btn-sm btn-outline btn-primary">
                <BsCloud class="h-3 w-3 stroke-none mx-1 text-error" />
                Login
              </button>
            </template>
          </template>
        </StatusMenuItem>
        <StatusMenuItem 
          :icon="BsCloud" 
          :is-connected="(isDejaServer)"
          item-label="DEJA Server" 
          @connect="handleDejaServer()"
          @disconnect="handleDisconnect()">    
          <VaChip v-if="(isDejaServer)" @click="$router.push({ name: 'deja-cloud' })" outline :color="isDejaServer ? 'success' : 'gray-500'">{{ layoutId }}</VaChip>          
        </StatusMenuItem>
        <StatusMenuItem 
          :icon="BiServer" 
          :is-connected="isDejaJS"
          item-label="DEJA.js" 
          page="dejajs"
          @disconnect="handleDisconnect()">    
          {{ isDejaJS ? 'Connected' : '' }}
          <template v-slot:desc>
            <!-- <p class="py-1">
              Connect DEJA Throttle to a DEJA.js server. The Definitive, Transformative, Innovative DCC-EX CommandStation API. Requires modern Chromium browser.
            </p> -->
          </template>
        </StatusMenuItem>
        <StatusMenuItem 
          :icon="BsUsbSymbol" 
          :is-connected="isSerial"
          item-label="DEJA Direct"  
          @disconnect="handleDisconnect()"
          @connect="handleSerial">    
          {{ isSerial ? 'Connected' : '' }}
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