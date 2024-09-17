<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useConnectionStore } from '@/connections/connectionStore.jsx'
  import { useCurrentUser } from 'vuefire'
  import StatusMenuItem from '@/core/StatusMenu/StatusMenuItem.component.vue'
  import useSerial from '@/api/serialApi'
  import { useDcc } from '@/api/dccApi'
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
  } from 'vue3-icons/bs'
  import { BiServer, BiSolidServer } from "vue3-icons/bi"
import { serverTimestamp } from 'firebase/database'
import DejaSignout from '@/deja-cloud/DejaSignout.vue'

  const user = useCurrentUser()
  const dccApi = useDcc()
  const serialApi = useSerial()
  const connStore = useConnectionStore()
  const { cloudConnected, dejaConnected, isEmulated, serialConnected, dccExConnected, layoutId } = storeToRefs(connStore)

  const handleDisconnect = () => {
    connStore.disconnect()
  }

  const handleStatus = () => {
    dccApi.send('getStatus', { })
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

  function getIcon() {
    return serialConnected.value
      ? BsUsbSymbol
      : dejaConnected.value
        ? BsFillLightningChargeFill
        : isEmulated.value
          ? BsCupHotFill
          : BsFillLightningChargeFill
  }

  const statusIcons = reactive([
    { 
      icon: getIcon(), 
      color:  (isEmulated.value || dejaConnected.value || serialConnected.value) ? 'text-success' : 'text-error' 
    },
    { 
      icon: BsCpu,
      color: (serialConnected.value || dejaConnected.value && layoutId || isEmulated.value) ? 'text-success' : 'text-error' 
    },
    { 
      icon: BsCloudFill, 
      color: 'text-neutral' 
    }
  ])

  const disabledColor = '#999999'

</script>

<template>
  <main class="flex ">
    <div class="dropdown dropdown-oepn dropdown-end">
      <div tabindex="0" role="button" class="btn m-1">
        <ul class="flex items-center justify-center">
          <li class="mx-1">
            <BsCloudFill v-if="cloudConnected" class="w-4 h-4 text-success  stroke-none" />
            <BsFillLightningChargeFill v-else-if="dejaConnected" class="w-4 h-4 text-success  stroke-none" />
            <BsUsbSymbol v-else-if="serialConnected" class="w-4 h-4 text-success  stroke-none" />
            <BsCupHotFill v-else-if="isEmulated" class="w-4 h-4 text-success  stroke-none" />
            <BsCloud v-else class="w-4 h-4 text-error" />
          </li>
          <li class="mx-1">
            <BsCpu v-if="!!layoutId && (dccExConnected || dejaConnected || isEmulated || serialConnected)" class="w-4 h-4 text-success  stroke-none" />
            <BsCpu v-else class="w-4 h-4 text-error" />
          </li>
          <li class="mx-1">
            <VaAvatar :size="16" :src="user?.photoURL" v-if="user" class="w-4 h-4 text-success  stroke-none" />
            <BsCloud v-else class="w-4 h-4 text-gray-400" />
          </li>
        </ul>
      </div>
      <div
        tabindex="0"
        class="dropdown-content z-20 w-auto">
        <div class="stats stats-vertical shadow bg-slate-900">

          <template v-if="!(dejaConnected || isEmulated || serialConnected || cloudConnected)">
            <StatusMenuItem 
              :icon="BsCloudFill" 
              :is-connected="false"
              item-label="DEJA Cloud" 
              page="deja"
              class="text-neutral">    
              <template v-slot:actions>
                <button @click="$router.push({ name: 'deja-cloud' })" class="btn btn-sm btn-outline mr-2" >
                  Login
                </button>
                <button @click="$router.push({ name: 'deja-cloud' })" class="btn btn-sm btn-outline" >
                  Sign Up
                </button>
              </template>
            </StatusMenuItem>
          </template>

          <template v-else>
            <StatusMenuItem 
              v-if="cloudConnected"
              :icon="BsCloudFill" 
              :is-connected="cloudConnected"
              item-label="DEJA Cloud" 
              page="deja-cloud"
              @disconnect="handleDisconnect"
              class="text-pink-400">              
              <h3 class="text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
                <VaAvatar :size="24" :src="user?.photoURL" />
                {{ user?.displayName }}
              </h3>
              <template v-slot:actions>
                <DejaSignout class="outline" outline />
              </template>
            </StatusMenuItem>
            <StatusMenuItem 
              v-if="dejaConnected"
              :icon="BsFillLightningChargeFill" 
              :is-connected="dejaConnected"
              item-label="DEJA.js" 
              page="dejajd"
              @disconnect="handleDisconnect"
              class="text-pink-400">    
              {{ dejaConnected ? layoutId : '' }}
            </StatusMenuItem>
            <StatusMenuItem 
              v-if="serialConnected"
              :icon="BsUsbSymbol" 
              :is-connected="serialConnected"
              item-label="USB Serial" 
              @disconnect="handleDisconnect"
              @connect="handleSerial">    
              {{ serialConnected ? 'Connected' : '' }}
            </StatusMenuItem>
            <StatusMenuItem 
              v-if="isEmulated"
              :icon="BsCupHotFill" 
              :is-connected="isEmulated"
              item-label="Emulator"
              class="text-pink-400"
              @disconnect="handleDisconnect"
              @connect="handleEmulator">    
              {{ isEmulated ? 'Connected' : '' }}
            </StatusMenuItem>
          </template>


          <StatusMenuItem
          
            :icon="BsCpu" 
            :is-connected="!!layoutId && (dccExConnected || dejaConnected || isEmulated || serialConnected)"
            item-label="DCC-EX CommandStation" 
            page="deja"
            @connect="$router.push({ name: 'connect' })"
            class="text-purple-600">
            <VaChip v-if="dccExConnected" outline closable>{{  layoutId }}</VaChip>
            <VaChip v-else-if="dejaConnected" outline closable>{{  layoutId }}</VaChip>
            <VaChip v-else-if="serialConnected" outline>USB Direct</VaChip>
            <VaChip v-else-if="isEmulated" outline>Emulator</VaChip>
            <VaChip :color="disabledColor" v-else outline>Disconnected</VaChip>
            <template v-if="layoutId" v-slot:actions>
              <button @click="handleDisconnect" class="btn btn-sm btn-outline btn-primary">
                <BsCpu class="h-3 w-3 stroke-none" />
                Disconnect
              </button>              
              <button class="btn btn-sm btn-outline mx-2" @click="handleStatus">
                Get Status
              </button>
              <!-- <button class="btn btn-sm btn-outline" disabled>
                View Log
              </button> -->
            </template>
            <template v-else v-slot:actions>
              
            </template>
          </StatusMenuItem>

        </div>
      </div>
    </div>
    
    <!-- <button
      @click="$router.push({ name: 'connect' })"
      class="btn btn-ghost relative flex flex-row"
          :class="{
          'text-blue-500': emulated(),
          'text-error': !anyConnected(),
          'text-green-300': anyConnected()
      }">
      <span class="">{{ getLabel() }}</span>
      <BsFillLightningChargeFill class="w-4 h-4 fill-green-300 stroke-green-300" />

      
    </button> -->



  </main>
</template>
