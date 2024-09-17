<script setup>
import { signOut } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { VaButton } from 'vuestic-ui'
import { useConnectionStore } from '@/connections/connectionStore'

const auth = useFirebaseAuth()
const user = useCurrentUser()
const connStore = useConnectionStore()

function handleSignOut() {
  connStore.disconnect()
  signOut(auth).catch((reason) => {
    console.error('Failed signOut', reason)
    error.value = reason
  })
}
</script>

<template>
  <VaButton @click="handleSignOut" preset="primary"  :disabled="!user">Sign out</VaButton>
</template>
