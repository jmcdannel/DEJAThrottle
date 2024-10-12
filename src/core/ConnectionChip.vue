<script setup lang="ts">
import { BsCloudFill } from 'vue3-icons/bs'
import { useCurrentUser } from 'vuefire'

const user = useCurrentUser()
  
</script>
<template>  
  <VaChip 
    v-if="user" 
    color="success" 
    class="cursor-pointer"
    @click="$router.push({ name: 'deja-cloud'})"
    outline 
    closable>
    <BsCloudFill class="mr-2" />
    DEJA Cloud
  </VaChip>
</template>