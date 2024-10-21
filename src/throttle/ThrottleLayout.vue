<script setup lang="ts">
  import { 
    MdViewArray,
    MdViewCarousel,
    MdViewColumn,
    MdOutlineViewCozy,
    MdOutlineViewHeadline,
    MdOutlineViewAgenda,
    MdOutlineViewSidebar
  } from "vue3-icons/md";
  import { PiSquareSplitHorizontalFill } from "vue3-icons/pi";

</script>
<template>
  <details class="dropdown dropdown-bottom">
    <summary class="btn btn-sm sm:btn-md btn-ghost border border-purple-600 border-opacity-50 rounded-r  hover:bg-purple-800 hover:bg-opacity-65" role="button" >
      <MdViewCarousel class="w-4 h-4 md:w-6 md:h-6 stroke-none" />
    </summary>    
    <ul class="menu dropdown-content bg-base-200 rounded-box">
      <li>
        <button @click="$emit('change', 'Array')" class="tooltip tooltip-left" data-tip="Array">
          <MdViewArray class="h-8 w-8 stroke-none" />
        </button>
      </li>
      <li>
        <button @click="$emit('change', 'List')" class="tooltip tooltip-left" data-tip="List">          
          <MdOutlineViewHeadline class="h-8 w-8 stroke-none" />
        </button>
      </li>
      <li>
        <button @click="$emit('change', 'Sidebar')" class="tooltip tooltip-left" data-tip="Sidebar">          
          <MdOutlineViewSidebar class="hidden md:block h-8 w-8 stroke-none" />
          <MdOutlineViewSidebar class="md:hidden h-8 w-8 stroke-none rotate-90" />
        </button>
      </li>
      <li>
        <button @click="$emit('change', 'Grid')" class="hidden lg:block tooltip tooltip-left" data-tip="Grid">          
          <MdOutlineViewCozy class="h-8 w-8 stroke-none" />
        </button>
      </li>
      <li>
        <button @click="$emit('change', 'Split')" class="tooltip tooltip-left" data-tip="Split">          
          <MdOutlineViewAgenda class="h-8 w-8 stroke-none rotate-90" />
        </button>
      </li>
    </ul>
  </details>
</template>