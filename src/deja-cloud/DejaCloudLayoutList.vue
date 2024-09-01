<script setup lang="ts">
import { collection, query, where } from 'firebase/firestore'
import { useCollection, useCurrentUser } from 'vuefire'
  import { 
    BsCloud,
    BsCloudFill,
  } from 'vue3-icons/bs'
import { db } from '@/firebase'
import { VaAvatar, VaButton, VaCardActions, VaChip } from 'vuestic-ui'

const user = useCurrentUser()
const layoutsRef = collection(db, 'layouts')
const layoutsQuery = query(layoutsRef, where('owner', '==', user.value?.email))
const layouts = useCollection(layoutsQuery)
</script>

<template>
  <main class="px-8 py-4 grid grid-cols-1 gap-4 md:grid-cols-2" v-if="user && layouts?.length > 0">
    <!-- <pre>{{ user }}</pre> -->
     <h3 class="text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
        <VaAvatar :size="48" :src="user?.photoURL" />
        Welcome, {{ user?.displayName }}
      </h3>
     <h4 class="text-sm uppercase text-indigo-500">
      Your Layouts
    </h4>      
    <nav class="flex flex-col items-center min-w-48">
      <button v-for="layout in layouts" 
        :key="layout.layoutId" 
        class="btn btn-lg btn-outline border-primary text-primary w-full my-1"
        @click="$emit('selectLayout', layout)">
        <BsCloudFill />
        {{ layout.layoutId }}
      </button>
    </nav>
  </main>
  <main v-else>
    Login to view your layouts
  </main>
</template>
