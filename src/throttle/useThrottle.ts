import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { collection, doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { db } from '@/firebase'
import { useDcc } from '@/api/dccApi'
import type { ConsistLoco } from './types'
import { useDejaCloud } from '@/deja-cloud/useDejaCloud'
import { useConnectionStore } from '@/connections/connectionStore'
import { useThrottleStore } from '@/throttle/throttleStore'

const SWITCH_DIR_DELAY = 1000 // delay in ms to switch direction - occurs when slider goes from positive to negative value - which an occur quickly

export const useThrottle = () => {
  const dccApi = useDcc()
  const dejaCloud = useDejaCloud()
  const connStore = useConnectionStore()
  const throttleStore = useThrottleStore()
  const { layoutId } = storeToRefs(connStore)

  async function updateSpeed(
    address: number,
    newSpeed: number,
    oldSpeed: number
  ) {
    if (!address) {
      return
    }
    let delay = 0

    if (newSpeed > 0 && oldSpeed < 0) {
      //change direction to forward
      await dccApi.setSpeed(address, 0)
      delay = SWITCH_DIR_DELAY
    } else if (newSpeed < 0 && oldSpeed > 0) {
      //change direction to reverse
      await dccApi.setSpeed(address, 0)
      delay = SWITCH_DIR_DELAY
    }

    if (newSpeed === 0) {
      // stop
      await dccApi.setSpeed(address, 0)
    } else {
      // set speed
      setTimeout(() => {
        dccApi.setSpeed(address, newSpeed)
      }, delay)
    }
  }

  function calculateConsistSpeed(
    newSpeed: number,
    consistLoco: ConsistLoco
  ): number | undefined {
    if (!consistLoco.trim) {
      return newSpeed
    }
    let consistSpeed = newSpeed
    if (consistLoco.direction) {
      consistSpeed =
        newSpeed > 0
          ? consistSpeed + consistLoco.trim
          : consistSpeed - consistLoco.trim
    } else {
      consistSpeed =
        newSpeed > 0
          ? consistSpeed - consistLoco.trim
          : consistSpeed + consistLoco.trim
    }

    if (newSpeed > 0 && consistSpeed <= 0) {
      consistSpeed = 1
    } else if (newSpeed < 0 && consistSpeed >= 0) {
      consistSpeed = -1
    }

    return consistSpeed
  }

  return {
    updateSpeed,
  }
}

export default useThrottle
