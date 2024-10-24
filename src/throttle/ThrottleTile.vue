<script setup lang="ts">
  import { ref, watch, type PropType } from 'vue'
  import { debounce } from 'vue-debounce'
  import ThrottleButtonControls from './ThrottleButtonControls.component.vue'
  import CurrentSpeed from './CurrentSpeed.component.vue'
  import type { Loco, LocoFunction, ConsistLoco, Throttle } from './types';
  import { useThrottle } from './useThrottle'

  const DEBOUNCE_DELAY = 100 // debounce speed changes by 100ms to prevent too many requests
  const SWITCH_DIR_DELAY = 1000 // delay in ms to switch direction - occurs when slider goes from positive to negative value - which an occur quickly

  const props = defineProps({
    throttle: {
      type: Object as PropType<Throttle>,
      required: true
    },
    loco: {
      type: Object as PropType<Loco>,
      required: false
    }
  })

  const emit = defineEmits(['release'])

  const { updateSpeed } = useThrottle()

  const functionsCmp = ref(null)
  const currentSpeed = ref(props.throttle?.speed || 0)

  const setSpeed = debounce((val: number): void => { currentSpeed.value = val; }, `${DEBOUNCE_DELAY}ms`)

  watch(currentSpeed, sendLocoSpeed)

  async function handleStop() {
    currentSpeed.value = 0
  }

  function adjustSpeed(val: number): void { // handle incremental speed changes
    currentSpeed.value = currentSpeed.value + val
  }

  async function clearLoco() {
    console.log('clearLoco', props.throttle)
    await handleStop()
    emit('release', props.throttle?.address)
  }

  async function sendLocoSpeed(newSpeed:number, oldSpeed:number) {
    console.log('sendLocoSpeed', { newSpeed, oldSpeed }, props.throttle?.address, props.throttle)
    updateSpeed(props.throttle?.address, props?.loco?.consist, newSpeed, oldSpeed)
  }

  function openFunctions() {
    functionsCmp.value && functionsCmp.value.openAll()
  }

  function openFunctionSettings() {
    functionsCmp.value && functionsCmp.value.openSettings()
  }
  
</script>
<template>
  <main class="rounded-2xl shadow-xl relative bg-gradient-to-br from-violet-800 to-cyan-500 bg-gradient-border " v-if="throttle">
    <!-- <pre>locoDocId:{{locoDocId}}</pre>-->
    <!-- <pre>loco:{{loco.functions}}</pre>  -->
    
    <section class="p-4 flex flex-row flex-wrap items-center justify-between overflow-auto">
        <CurrentSpeed :speed="currentSpeed" class="order-0" />
        <ThrottleButtonControls :speed="currentSpeed" @update:currentSpeed="adjustSpeed" @stop="handleStop" horizontal class="order-2 sm:order-1 w-full sm:w-auto"  />
        <div class="avatar placeholder order-1 sm:order-2">
          <div class="bg-sky-500 text-neutral-content rounded-full w-12 md:w-24">
            <span class="text-xl md:text-4xl bold">{{ throttle.address || '?' }}</span>
          </div>
        </div>
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