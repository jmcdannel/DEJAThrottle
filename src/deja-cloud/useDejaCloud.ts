import { computed } from 'vue'
import {
  collection,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  addDoc,
  serverTimestamp,
  where,
  doc,
  deleteField,
} from 'firebase/firestore'
import { storeToRefs } from 'pinia'
import { useDocument, useCollection, firestoreDefaultConverter } from 'vuefire'
import { db } from '@/firebase'
import type { Loco, LocoFunction, Throttle } from '@/throttle/types'
import { useConnectionStore } from '@/connections/connectionStore'

export function useDejaCloud() {
  const connStore = useConnectionStore()
  const { layoutId } = storeToRefs(connStore)

  async function send({ action, payload }) {
    switch (action) {
      case 'throttle':
        sendThrottleUpdate({ action, payload })
        break
      default:
        sendDccCommand({ action, payload })
        break
    }
  }

  function getLayout() {
    const layoutDoc = layoutId.value ? doc(db, 'layouts', layoutId.value) : null
    const layout = useDocument(layoutDoc)
    return layout
  }

  async function updateFunctions(id: string, functions: LocoFunction[]) {
    console.log('dejaCloud updateLoco', id, functions)
    try {
      const locoDoc = doc(db, `layouts/${layoutId.value}/locos`, id)
      await setDoc(locoDoc, { functions }, { merge: true })
    } catch (e) {
      console.error('Error updating consist: ', e)
    }
  }

  async function updateConsist(locoId, consist) {
    console.log('dejaCloud updateConsist', locoId, consist)
    try {
      const locoDoc = doc(
        db,
        `layouts/${layoutId.value}/locos`,
        locoId.toString()
      )
      await setDoc(locoDoc, { consist }, { merge: true })
    } catch (e) {
      console.error('Error updating consist: ', e)
    }
  }

  async function createLoco(locoId: number, name: string | undefined) {
    console.log('dejaCloud createLoco', locoId)
    try {
      const loco = {
        locoId,
        name,
        timestamp: serverTimestamp(),
      }
      const newLocoDoc = await addDoc(
        collection(db, `layouts/${layoutId.value}/locos`),
        loco
      )
      console.log('loco written with ID: ', newLocoDoc)
      return newLocoDoc.id
    } catch (e) {
      console.error('Error adding throttle: ', e)
    }
  }

  function getLoco(address: string) {
    console.log('dejaCloud getLoco', address, typeof address)
    try {
      return useCollection(
        query(
          collection(db, `layouts/${layoutId.value}/locos`),
          where('locoId', '==', parseInt(address))
        )
      )
    } catch (e) {
      console.error('Error getting loco: ', e)
    }
  }

  async function getLocoDbId(address: number) {
    const locos = query(
      collection(db, `layouts/${layoutId.value}/locos`),
      where('locoId', '==', address)
    )
    const querySnapshot = await getDocs(locos)
    console.log('getLocoDbId', querySnapshot.docs[0], querySnapshot.docs[0].id)
    return await querySnapshot.docs[0].id
  }

  async function getLocoById(id: string) {
    console.log('dejaCloud getLocoById', id, typeof id)
    // return useDocument(doc(db, `layouts/${layoutId.value}/locos`, id))
    const docRef = doc(db, `layouts/${layoutId.value}/locos`, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data(), docSnap.id, docSnap.ref)
      return docSnap.data()
    } else {
      // docSnap.data() will be undefined in this case
      console.error('No such document!')
    }
  }

  function getLocos() {
    const locosCollection = layoutId.value
      ? collection(db, `layouts/${layoutId.value}/locos`)
      : null
    const locos = useCollection(locosCollection)
    console.log('getLocos', locosCollection, locos, layoutId.value)
    return locos
  }

  function acquireThrottle(address: number) {
    try {
      const throttleSource = computed(() => {
        async function fetchDoc(docRef) {
          const data = {
            address: parseInt(address),
            speed: 0,
            direction: false,
            timestamp: serverTimestamp(),
          }
          const newThrottleDoc = await setDoc(docRef, data)
          return newThrottleDoc
        }
        const docRef = doc(
          db,
          `layouts/${layoutId.value}/throttles`,
          address.toString()
        ).withConverter<Throttle>({
          fromFirestore: (snapshot: any) => {
            const data = firestoreDefaultConverter.fromFirestore(snapshot)
            if (!data) return null
            return data
          },
          toFirestore: firestoreDefaultConverter.toFirestore,
        })
        fetchDoc(docRef)
        return docRef
      })

      return useDocument<Throttle>(throttleSource)
    } catch (e) {
      console.error('Error adding throttle: ', e)
    }
  }

  async function releaseThrottle(throttleId: number) {
    try {
      console.log('dejaCloud releaseThrottle', throttleId)
      await deleteDoc(
        doc(db, `layouts/${layoutId.value}/throttles`, throttleId.toString())
      )
    } catch (e) {
      console.error('Error adding throttle: ', e)
    }
  }

  async function sendThrottleUpdate({ action, payload }) {
    console.log('dejaCloud SEND', action, payload)
    try {
      const throttle = {
        speed: Math.abs(payload.speed),
        direction: payload.speed > 0 ? true : false,
        timestamp: serverTimestamp(),
      }

      await setDoc(
        doc(
          db,
          `layouts/${layoutId.value}/throttles`,
          payload.address.toString()
        ),
        throttle,
        { merge: true }
      )

      console.log('throttle written with ID: ', throttle)
    } catch (e) {
      console.error('Error adding throttle: ', e)
    }
  }

  async function sendDccCommand({ action, payload }) {
    // console.log('dejaCloud SEND', action, payload)
    try {
      const command = {
        action,
        payload: JSON.stringify(payload),
        timestamp: serverTimestamp(),
      }

      await addDoc(
        collection(db, `layouts/${layoutId.value}/dccCommands`),
        command
      )
      // console.log('Document written with ID: ', command)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  return {
    send,
    acquireThrottle,
    releaseThrottle,
    createLoco,
    getLayout,
    getLoco,
    updateConsist,
    getLocos,
    updateFunctions,
    getLocoById,
    getLocoDbId,
  }
}