<script setup lang="ts">
  import { onMounted, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useCurrentUser, useDocument } from 'vuefire'
  import { doc } from "firebase/firestore"
  import { db } from "@/firebase"
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import { useConnectionStore } from '@/connections/connectionStore'
  import { useDejaCloudStore } from '@/deja-cloud/dejaCloudStore'
  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'
  import { useDcc } from '@/api/dccApi'
import { cp } from 'fs'

  const user = useCurrentUser()
  const conn = useConnectionStore()
  const dejaCloudStore = useDejaCloudStore()
  const { getLocos } = useDejaCloud()
  const dcc = useDcc()

  dayjs.extend(relativeTime)

  const { layoutId, dccExConnected } = storeToRefs(conn)

  const layoutDoc = computed(() => layoutId.value 
    ? doc(db, "layouts", layoutId.value) 
    : null)
    
  const layout = useDocument(layoutDoc)


  const lastUpdated = computed(() => layout?.value?.dccEx.timestamp.seconds)
  const lastConnected = computed(() => layout?.value?.dccEx.lastConnected?.seconds)
  const client = computed(() => layout?.value?.dccEx.client)

  watch(lastUpdated, (newVal, oldVal) => {
    const now = dayjs()
    const updated = dayjs.unix(newVal)
    if (!dccExConnected.value && now.diff(updated, 'minute') < 2) {
      console.log('layout updated', now.diff(updated, 'minute'), now.diff(updated, 'second'), now.diff(updated))
      conn.connectDccEx()
    }
  })

  watch(lastConnected, (newVal, oldVal) => {
    console.log('lastConnected', newVal, oldVal)
    if (newVal) {
      const now = dayjs()
      const connected = dayjs.unix(newVal)
      console.log('layout lastConnected', now.diff(connected, 'minute'), now.diff(connected, 'second'), now.diff(connected))
      if (!dccExConnected.value && now.diff(connected, 'minute') < 2) {
        conn.connectDccEx()
      }
    }
  })

  watch(client, (newVal, oldVal) => {
    console.log('client changed', newVal, oldVal)
    if (newVal) {
      conn.connectionType = newVal
    }
  })

  onMounted(async () => {
    try {
      if (layoutId.value) {
        console.log('CONNECTING TO DEJA CLOUD', !!user.value, user?.value?.email, layoutId?.value)
        // conn.connect('cloud', layoutId.value)
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