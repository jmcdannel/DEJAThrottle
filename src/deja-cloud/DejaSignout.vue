<script setup>
import { ref, onMounted } from 'vue'
import { signOut } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { VaAvatar, VaButton, VaCardActions, VaChip } from 'vuestic-ui'

const auth = useFirebaseAuth()
const user = useCurrentUser()

function handleSignOut() {
  signOut(auth).catch((reason) => {
    console.error('Failed signOut', reason)
    error.value = reason
  })
}
</script>

<template>
  <VaButton @click="handleSignOut" preset="primary"  :disabled="!user">Sign out</VaButton>
</template>
