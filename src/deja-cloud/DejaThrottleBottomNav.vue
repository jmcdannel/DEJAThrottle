<script lang="ts" setup>
import { useCollection } from 'vuefire'
import { useDejaCloud } from '@/deja-cloud/useDejaCloud'
import { VaAvatar } from 'vuestic-ui'

const { getThrottles } = useDejaCloud()
const throttles = getThrottles()

</script>

<template>
  <template v-if="throttles">
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
</template>