<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const viewAs = useStorage('@DEJA/prefs/throttleView', 'Array')

</script>
<template>

<v-speed-dial
    location="top center"
    transition="fade-transition"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-fab
        v-bind="activatorProps"
        class="w-10"
        size="small"
        icon="mdi-dots-vertical"
        color="secondary"
      ></v-fab>
    </template>
    <v-btn 
      @click="viewAs = 'Array'" icon="mdi-view-gallery-outline">
    </v-btn >
    <v-btn  
      @click="viewAs = 'List'" icon="mdi-view-sequential-outline">
    </v-btn>
    <v-btn  
      @click="viewAs = 'Grid'" icon="mdi-view-grid-plus-outline">
    </v-btn>
    <v-btn  
      @click="viewAs = 'Split'" icon="mdi-view-agenda-outline" >
    </v-btn>
  </v-speed-dial>
</template>
