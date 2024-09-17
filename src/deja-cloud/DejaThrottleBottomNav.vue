<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { collection } from 'firebase/firestore'
import { useCollection } from 'vuefire'
import { db } from '@/firebase'
import { useConnectionStore } from "@/connections/connectionStore.jsx"
import { VaAvatar } from 'vuestic-ui'

const connStore = useConnectionStore()
const { layoutId } = storeToRefs(connStore)
const throttles = layoutId.value
  ? useCollection(collection(db, `layouts/${layoutId.value}/throttles`))
  : null

console.log('throttles', throttles, layoutId.value)
</script>

<template>

  <router-link
    v-for="throttle in throttles"
      :key="throttle.id"
      :to="`/cloud-throttle/${throttle?.id}`"
      custom
      v-slot="{ navigate }"
    >
      <button 
        class="text-primary" 
        :class="{ active: ($route?.name === 'home' || $route?.name === 'throttle') }" 
        @click="navigate" 
        style="--va-badge-text-wrapper-border-radius: 50%;"
        role="link">
        <VaBadge
          overlap
          :text="throttle.speed.toString()"
        >
          <VaAvatar size="small">{{ throttle?.id }}</VaAvatar>
        </VaBadge>
      </button>
    </router-link>
</template>