<script setup lang="ts">
  import { 
    PiHeadlightsFill,
    PiBellFill
  } from 'vue3-icons/pi'
  import { 
    FaBullhorn,
    FaChevronCircleLeft,
    FaChevronCircleRight,
    FaMinus,
    FaPlus,
    FaRegStar,
    FaTimesCircle,
  } from 'vue3-icons/fa'
  import { RiTrainWifiFill } from 'vue3-icons/ri'

  defineProps({
    icon: {
      type: String
    }
  })

</script>
<template>
  <PiHeadlightsFill v-if="icon === 'light'"/>
  <PiBellFill v-else-if="icon === 'bell'" />
  <FaBullhorn v-else-if="icon === 'horn'"/>
  <template v-else>
    <RiTrainWifiFill  />
  </template>
</template>