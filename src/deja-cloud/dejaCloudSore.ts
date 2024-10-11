import { defineStore } from 'pinia'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Loco } from '@/throttle/types'

export const useDejaCloudStore = defineStore('dejaCloud', {
  state: () => ({
    locoDocId: null as string | null,
    locos: {} as ReturnType<typeof collection>,
    throttles: {} as ReturnType<typeof collection>,
  }),
  actions: {
    async init(layoutId: string) {
      this.locos = collection(db, `layouts/${layoutId}/locos`)
      this.throttles = collection(db, `layouts/${layoutId}/throttles`)
    },
  },
})

export default useDejaCloudStore
