<script setup lang="ts">
  import { onMounted, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useCurrentUser, useDocument } from 'vuefire'
  import { doc } from "firebase/firestore"
  import { db } from "@/firebase"
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import { useConnectionStore } from '@/connections/connectionStore'
  import { useDejaCloudStore } from '@/deja-cloud/dejaCloudSore'
  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'
  import { useDcc } from '@/api/dccApi'

  const user = useCurrentUser()
  const conn = useConnectionStore()
  const dejaCloudStore = useDejaCloudStore()
  const { getLocos } = useDejaCloud()
  const dcc = useDcc()

  dayjs.extend(relativeTime)

  const { layoutId, cloudConnected, dccExConnected } = storeToRefs(conn)

  const layoutDoc = computed(() => layoutId.value 
    ? doc(db, "layouts", layoutId.value) 
    : null)
    
  const layout = useDocument(layoutDoc)


  const lastUpdated = computed(() => layout?.value?.dccEx.timestamp.seconds)

  watch(lastUpdated, (newVal, oldVal) => {
    const now = dayjs()
    const updated = dayjs.unix(newVal)
    if (!dccExConnected.value && now.diff(updated, 'minute') < 2) {
      console.log('layout updated', now.diff(updated, 'minute'), now.diff(updated, 'second'), now.diff(updated))
      conn.connectDccEx()
    }
  })

  onMounted(async () => {
    try {
      if (layoutId.value) {
        console.log('CONNECTING TO DEJA CLOUD', !!user, user?.value?.email, layoutId?.value, cloudConnected.value)
        conn.connect('cloud', layoutId.value)
        await dejaCloudStore.init(layoutId.value)
        dcc.send('getStatus', { layoutId: layoutId.value })
      }
    } catch (err) {
      console.error(err);
    }
  });
</script>

<template>
</template>