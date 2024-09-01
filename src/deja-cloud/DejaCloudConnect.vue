<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useCurrentUser } from 'vuefire'
  import { useConnectionStore } from '@/connections/connectionStore'
  import { useDcc } from '@/api/dccApi'

  const user = useCurrentUser()
  const conn = useConnectionStore()
  const dcc = useDcc()

  const { layoutId, cloudConnected } = storeToRefs(conn)

  onMounted(async () => {
    try {
      console.log('CONNECTING TO DEJA CLOUD', !!user, user?.value?.email, layoutId?.value, cloudConnected.value)
      conn.connect('cloud', layoutId?.value)
      dcc.send('getStatus', { layoutId: layoutId.value })
    } catch (err) {
      console.error(err);
    }
  });
</script>

<template>
</template>