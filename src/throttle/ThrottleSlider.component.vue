<script setup lang="ts">
import { ref, computed } from 'vue'
import { refDebounced, watchDebounced } from '@vueuse/core'

  const emit = defineEmits(['update', 'stop'])

  const props  = defineProps({
    speed: {
      type: Number,
      required: true
    },
    throttleVal: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    direction: {
      type: Boolean,
      default: false
    },
    showSteps: {
      type: Boolean,
      default: false
    }
  })

  const sliderSpeed = computed( () => Math.abs(props.speed) )
  const sliderVal = ref(Math.abs(props.speed))

  watchDebounced(sliderSpeed, () => {
    console.log('watchDebounced', sliderVal.value)
    sliderVal.value = sliderSpeed.value
    // emit('update', sliderVal.value)
  }, { debounce: 500, maxWait: 1000 })


</script>
<template>
  <VaSlider
    v-model="sliderVal"
    class=""
    :label="direction ? 'FWD' : 'REV'"
    :label-color="direction ? 'green-500' : 'red-500'"
    vertical
    track-label-visible
    pins
    @change="emit('update', sliderVal)"
    :step="1"
  >
  <template #trackLabel="{ value }">
      <VaChip
        :color="direction ? 'green-500' : 'red-500'"
        size="small"
      >
        {{ value }}
      </VaChip>
    </template>
  </VaSlider>
</template>
<style >
:root {
  --va-slider-handler-width: 4rem;
  --va-slider-handler-border-radius: 0.5rem;
  --va-slider-handler-left: -1rem;
  --va-slider-handler-transition: .5s;

  --va-slider-vertical-label-inverse-left: 2rem;
  --va-slider-vertical-dot-value-top: 1rem;
  --va-slider-vertical-dot-value-left: 5.5rem;
  --va-slider-vertical-track-width: 2rem;
}
.va-slider--vertical .va-slider__container {
  width: 2.2rem;
}
.va-slider--vertical .va-slider__mark {
  width: 2.2rem;
}
</style>