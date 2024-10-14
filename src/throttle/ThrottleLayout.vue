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
        <a class="tooltip tooltip-left" data-tip="Array">
          <MdViewArray class="h-5 w-5" />
        </a>
      </li>
      <li>
        <a class="tooltip tooltip-left" data-tip="Carousel">          
          <MdViewCarousel class="h-5 w-5" />
        </a>
      </li>
      <li>
        <a class="tooltip tooltip-left" data-tip="Split">          
          <PiSquareSplitHorizontalFill class="h-5 w-5" />
        </a>
      </li>
    </ul>
  </details>
</template>