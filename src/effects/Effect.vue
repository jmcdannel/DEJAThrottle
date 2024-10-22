<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEfx } from '@/api/useEfx'

const { efxTypes, runEffect } = useEfx()

const props = defineProps({
  efx: Object,
  efxId: String,
})


const efxType = computed(() => efxTypes.find((type) => type.value === props?.efx?.type))

async function handleEfx (event: Event) {
  console.log('handleEfx', props.efx, props.efx?.id, event, event?.target?.checked)
  props?.efx && props?.efxId && await runEffect({
      ...props.efx,
      id: props.efxId,
      state: event?.target?.checked
  })
}

</script>
<template>
  <div class="card card-compact bg-base-100 shadow-xl w-full">
    <figure>
      <component :is="efxType?.icon" class="w-full h-24 stroke-none"></component>
      <!-- <img
        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        alt="Shoes" /> -->

      <div class="form-control w-52">
        <label class="label cursor-pointer">
          <span class="label-text sr-only">Remember me</span>
          <input type="checkbox" class="toggle toggle-primary" checked="checked" @click="handleEfx" />
        </label>
      </div>
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{efx?.name}}</h2>
      <p>{{ efxId }}</p>
      <p>{{ efxType?.label }}</p>
      <p>{{ efx?.device }}</p>
    </div>
  </div>
</template>
