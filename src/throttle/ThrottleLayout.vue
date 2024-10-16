<script setup lang="ts">
  import { 
    MdViewArray,
    MdViewCarousel,
    MdViewColumn,
    MdViewList,
  } from "vue3-icons/md";
  import { PiSquareSplitHorizontalFill } from "vue3-icons/pi";

</script>
<template>
  <details class="dropdown dropdown-bottom">
    <summary class="btn btn-square btn-secondary" role="button" >
      <MdViewCarousel class="w-8 h-8 stroke-none" />
    </summary>    
    <ul class="menu dropdown-content bg-base-200 rounded-box">
      <li>
        <button @click="$emit('change', 'Array')" class="tooltip tooltip-left" data-tip="Array">
          <MdViewArray class="h-5 w-5" />
        </button>
      </li>
      <li>
        <button @click="$emit('change', 'Carousel')" class="tooltip tooltip-left" data-tip="Carousel">          
          <MdViewCarousel class="h-5 w-5" />
        </button>
      </li>
      <li>
        <button @click="$emit('change', '2up')" class="tooltip tooltip-left" data-tip="Split">          
          <PiSquareSplitHorizontalFill class="h-5 w-5" />
        </button>
      </li>
    </ul>
  </details>
</template>