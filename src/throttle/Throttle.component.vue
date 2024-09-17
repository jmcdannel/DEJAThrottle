<script setup lang="ts">
  import { ref, watch, computed, type PropType } from 'vue'
  import { debounce } from 'vue-debounce'
  import { FaParking } from "vue3-icons/fa";
  import ThrottleButtonControls from './ThrottleButtonControls.component.vue'
  import ThrottleSliderControls from './ThrottleSliderControls.component.vue'
  import CurrentSpeed from './CurrentSpeed.component.vue'
  import ThrottleHeader from './ThrottleHeader.component.vue'
  import Consist from '@/consist/Consist.component.vue'
  import Functions from '@/functions/Functions.component.vue'
  import router from '../router'
  import type { Loco, LocoFunction, ConsistLoco, Throttle } from './types';
  import { useThrottle } from './useThrottle'
  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'

  const DEBOUNCE_DELAY = 100 // debounce speed changes by 100ms to prevent too many requests
  const SWITCH_DIR_DELAY = 1000 // delay in ms to switch direction - occurs when slider goes from positive to negative value - which an occur quickly

  const props = defineProps({
    throttle: {
      type: Object as PropType<Throttle>,
      required: true
    }
  })

  const emit = defineEmits(['release'])

  const { updateSpeed } = useThrottle()
  const { getLoco } = useDejaCloud()

  const locos = props?.throttle?.address
    ? getLoco(props.throttle.address.toString())
    : null

  const currentSpeed = ref(props.throttle?.speed || 0)

  const setSpeed = debounce((val: number): void => { currentSpeed.value = val; }, `${DEBOUNCE_DELAY}ms`)

  async function handleStop() {
    currentSpeed.value = 0
  }

  function adjustSpeed(val: number): void { // handle incremental speed changes
    currentSpeed.value = currentSpeed.value + val
  }

  function setSliderSpeed(val: number): void { // handle slider changes
    setSpeed(parseInt(val.toString()))
  }

  function handleSaveLoco(loco: Loco): void {
    // if (loco) {
    //   locos.value = locos.value.map(l => l.address === loco.address ? loco : l)
    //   throttleStore.setLocos(locos.value)
    // }
  }

  async function clearLoco() {
    console.log('clearLoco', props.throttle)
    await handleStop()
    emit('release')
    router.push({ name: 'home' })
  }

  async function sendLocoSpeed(newSpeed:number, oldSpeed:number) {
    console.log('sendLocoSpeed', { newSpeed, oldSpeed }, props.throttle?.address, props.throttle)
    updateSpeed(props.throttle?.address, newSpeed, oldSpeed)
    
  }

  watch(currentSpeed, sendLocoSpeed)
</script>
<template>
  <main class="card m-2 shadow-xl flex-grow overflow-auto relative bg-gradient-to-br from-violet-800 to-cyan-500 bg-gradient-border " v-if="throttle">
    <!-- <pre>{{throttle.address}}</pre> -->
    <ThrottleHeader :address="throttle.address">
      <aside class="flex items-center ">
        <Consist v-if="locos" :loco="locos?.[0]" />
        <button class="text-sky-500" @click="clearLoco">
          <FaParking alt="clear layout" class="h-12 w-12" />
        </button>
      </aside>
    </ThrottleHeader>
    <section class="throttle flex flex-row flex-grow overflow-auto">
      <section class="pt-4 pb-8 px-1 text-center  flex-1">
        <ThrottleSliderControls :speed="currentSpeed" @update:currentSpeed="setSliderSpeed" @stop="handleStop" />  
      </section>
      <section class="pt-4 flex flex-col items-center justify-between flex-1">
        <Functions v-if="locos" :loco="locos?.[0]" @save-loco="handleSaveLoco" />
        <CurrentSpeed :speed="currentSpeed" />
        <ThrottleButtonControls :speed="currentSpeed" @update:currentSpeed="adjustSpeed" @stop="handleStop" />
      </section>
    </section>
  </main>  
</template>
<style scroped>
  .bg-gradient-border {
    position: relative;
    z-index: 2;
  }
  .bg-gradient-border:before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background-color: #0d0c14;  
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");  
    z-index: -1;
    border-radius: var(--rounded-box, 1rem);
  }
</style>