import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { storeToRefs } from "pinia"
import { db } from "@/firebase"
import { useConnectionStore } from "@/connections/connectionStore.jsx"

export function useDejaCloud() {
  const connStore = useConnectionStore()
  const { layoutId } = storeToRefs(connStore)

  async function send({ action, payload }) {
    console.log("dejaCloud SEND", action, payload)
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
      console.log("Document written with ID: ", command)
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  }

  return {
    send,
  }
}
