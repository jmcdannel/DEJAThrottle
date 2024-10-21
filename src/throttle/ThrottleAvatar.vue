<script setup lang="ts">
  import { ref, watch, computed, onMounted, type PropType } from 'vue'
  import { debounce } from 'vue-debounce'
  import stopIconSvg from '@/assets/icons/stop.svg'
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

  const emit = defineEmits(['release', 'change', 'select'])

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

  function setSliderSpeed(val: number): void { // handle slider changes
    setSpeed(parseInt(val.toString()))
  }

  async function clearLoco() {
    console.log('clearLoco', props.throttle)
    await handleStop()
    emit('release', props.throttle?.address)
  }

  async function sendLocoSpeed(newSpeed:number, oldSpeed:number) {
    console.log('sendLocoSpeed', { newSpeed, oldSpeed }, props.throttle?.address, props.throttle)
    updateSpeed(props.throttle?.address, newSpeed, oldSpeed)
  }

  function openFunctions() {
    functionsCmp.value && functionsCmp.value.openAll()
  }

  function openFunctionSettings() {
    functionsCmp.value && functionsCmp.value.openSettings()
  }
  
</script>
<template>
  <main class="my-8">
    <div class="indicator">
      <span class="indicator-item indicator-start badge badge-secondary p-3">{{ currentSpeed }}</span>
      <div class="indicator-item indicator-top indicator-end">
        <button class="btn btn-sm btn-error opacity-70"><img :src="stopIconSvg" class="h-3 w-3 relative" /></button>
      </div>
      <div class="avatar placeholder order-1 sm:order-2 cursor-pointer" @click="$emit('select', throttle.address)">
        <div class="bg-sky-500 text-neutral-content rounded-full w-20 md:w-24">
          <span class="text-2xl md:text-4xl bold">{{ throttle.address || '?' }}</span>
        </div>
      </div>
      <span v-if="loco?.consist?.length" class="indicator-item indicator-middle indicator-end badge badge-warning opacity-75">{{ loco?.consist?.length }}</span>
      <div class="indicator-item indicator-bottom indicator-start">
        <button class="btn btn-sm btn-accent opacity-70">-</button>
      </div>
      <div class="indicator-item indicator-bottom indicator-end">
        <button class="btn btn-sm btn-accent opacity-70">+</button>
      </div>
    </div>
  </main>
  <!-- <main class="rounded-2xl shadow-xl relative bg-gradient-to-br from-violet-800 to-cyan-500 bg-gradient-border " v-if="throttle">
   
    <section class="p-4 flex flex-row flex-wrap items-center justify-between overflow-auto">
        <CurrentSpeed :speed="currentSpeed" class="order-0" />
        <ThrottleButtonControls :speed="currentSpeed" @update:currentSpeed="adjustSpeed" @stop="handleStop" horizontal class="order-2 sm:order-1 w-full sm:w-auto"  />
        
      </section>
  </main>   -->
</template>