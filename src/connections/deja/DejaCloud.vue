<script setup lang="ts">
  import {  useCurrentUser } from 'vuefire'
  import router from '@/router'
  import tttButton from '@/shared/ui/tttButton.component.vue'
  import { useConnectionStore } from '@/connections/connectionStore.jsx'
  import DejaLogin from '@/deja-cloud/DejaLogin.vue'
  import DejaSignout from '@/deja-cloud/DejaSignout.vue'
  
  const user = useCurrentUser()
  const conn = useConnectionStore()

  function handleCancelClick() {
    router.push({ name: 'connect' })
  }

  function handleAuthenticated() {
    console.log('DejaCloud.handleAuthenticated', user)
    router.push({ name: 'connect' })
  }


</script>

<template>
  <main class="p-4 flex flex-col justify-between w-full overflow-auto forest-background">
    <main class="my-1 pt-2 flex-grow flex flex-col">  
      <template v-if="!!user">
        <h3 class="text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
          <VaAvatar :size="48" :src="user?.photoURL" />
          Welcome, {{ user?.displayName }}
        </h3>
      </template>
      <template v-else>
      </template>
      <DejaLogin v-on:auth="handleAuthenticated" :is-authenticated="!!user" />
      <div class="flex-grow flex justify-between items-end">
        <tttButton variant="warning" size="lg" @click="handleCancelClick">Cancel</tttButton>
        <DejaSignout v-if="!!user" />
        <!-- <tttButton v-if="!!user" variant="error" size="lg" @click="handleDisconnectClick">Disconnect</tttButton> -->
      </div>
    </main>
  </main>
</template>