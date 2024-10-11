<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { BsCloudFill } from 'vue3-icons/bs'
import { useCurrentUser } from 'vuefire'
  import { useConnectionStore } from '@/connections/connectionStore'

const user = useCurrentUser()
const { 
    dejaConnected, 
    dccExConnected, 
    isEmulated, 
    serialConnected, 
    cloudConnected, 
    layoutId
  } = storeToRefs(useConnectionStore())
  
</script>
<template>  
  <VaChip 
    v-if="cloudConnected" 
    color="success" 
    class="cursor-pointer"
    @click="$router.push({ name: 'deja-cloud'})"
    outline 
    closable>
    <BsCloudFill class="mr-2" />
    DEJA Cloud
  </VaChip>
</template>