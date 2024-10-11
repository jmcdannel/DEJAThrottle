<script setup lang="ts">
  import { useFunctionIcon } from '@/functions/useFunctionIcon'
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

  const props = defineProps({
    icon: {
      type: String
    }
  })

  const functionIcons = useFunctionIcon()

  const iconCmp = functionIcons.getIconComponent(props?.icon || '')

</script>
<template>
  <component :is="iconCmp" class="h-8 w-8" />
</template>