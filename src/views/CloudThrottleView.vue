<script async setup lang="ts">
  import { computed, onMounted, watch, shallowRef, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStorage } from '@vueuse/core'
  import router from '../router'

  import ThrottleLayout from '@/throttle/ThrottleLayout.vue'
  import ThrottleComponent from '@/throttle/Throttle.component.vue'
  import ThrottleTile from '@/throttle/ThrottleTile.vue'
  import ThrottleAvatar from '@/throttle/ThrottleAvatar.vue'

  import { useLocos } from '@/api/useLocos'
  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'

  const route = useRoute()
  const carouselElement = ref(null)
  const { releaseThrottle } = useDejaCloud()
  const { getThrottles, getLocos } = useLocos()

  const viewAs = useStorage('@DEJA/prefs/throttleView', 'Array')

  const address = ref(parseInt(route.params.address?.toString()))
  const throttles = getThrottles()
  const locos = getLocos()
  const currentThrottle = computed(() => throttles?.value.find((throttle) => throttle.address === address.value))
  
  onMounted(async () => {
    const throttleIdx = throttles?.value.findIndex((throttle) => throttle.address === address.value)
    console.log('onMounted address', address.value, throttleIdx)
    scrollCarousel(throttleIdx)
  })

  watch(
    () => route.params.address,
    (newId, oldId) => {
      console.log('watch oute.params.address', newId, oldId)
      address.value = parseInt(newId?.toString())
      currentThrottle.value = throttles?.value.find((throttle) => throttle.address === address.value)
    }
  )

  watch(address, async (newAddress, oldAddress) => {
    const throttleIdx = throttles?.value.findIndex((throttle) => throttle.address === newAddress)
    console.log('watch addres', newAddress, oldAddress, throttleIdx)
    scrollCarousel(throttleIdx)
  })

  async function handleRelease(address: number) {
    console.log('handleRelease', address)
    if (address) {
      await releaseThrottle(address)
      router.push({ name: 'home' })
    }
  }

  function getLoco(locoAddress: number) {
    return locos?.value.find((loco) => loco.locoId === locoAddress)
  }

  function scrollCarousel(targetImageNumber) {
    if (!carouselElement.value) {
      return
    }
    let carouselWidth = carouselElement.value.clientWidth;
    let targetXPixel = (carouselWidth * targetImageNumber) + 1
    carouselElement.value.scrollTo(targetXPixel, 0)
  }

  function handleViewChange(newView:string) {
    console.log('handleViewChange', newView)
    viewAs.value = newView
  }

  const itemClasses = computed(() => {
    return {
      'carousel-item': true,
      'relative': true,
      'w-full': viewAs.value === 'Array',
      'w-1/2': viewAs.value === 'Split'
    }
  })

</script>

<template>
  <div class="flex flex-col flex-grow overflow-scroll">
    <ThrottleLayout @change="handleViewChange" class="bg-slate-700 relative z-40" />
    <div class="flex flex-grow p-2">
      <template v-if="locos?.length  && throttles?.length">
        <template v-if="viewAs === 'Array' || viewAs === 'Split'">
          <div 
            class="carousel w-full"
            ref="carouselElement">
            <div 
              :class="itemClasses"
              v-for="(throttle, index) in throttles"   
              :id="`slide${index.toString()}`"
              :key="throttle.id">
              <ThrottleComponent                  
                :throttle="throttle" 
                :loco="getLoco(throttle.address)"
                :viewAs="viewAs"
                @release="handleRelease"
                @change="handleViewChange"
              />
              <div v-if="viewAs !== 'Split'" class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
                <button @click="scrollCarousel(index-1)" class="btn btn-circle" :class="index > 0 ? 'visible' : 'invisible'">{{ throttles?.[index-1]?.address }}</button>
                <button @click="scrollCarousel(index+1)" class="btn btn-circle" :class="index < throttles.length-1 ? 'visible' : 'invisible'">{{ throttles?.[index+1]?.address }}</button>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="viewAs === 'List'">      
          <div class="flex-grow flex flex-col relative overflow-auto">
            <div class="flex-grow"></div>
            <ThrottleTile 
              v-for="throttle in throttles"
              :key="throttle.id"
              :throttle="throttle" 
              :loco="getLoco(throttle.address)"
              @release="handleRelease"
              @change="handleViewChange"
            />
          </div>
        </template>
        <template v-else-if="viewAs === 'Grid'">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <ThrottleTile 
              v-for="throttle in throttles"
              :key="throttle.id"
              :throttle="throttle" 
              :loco="getLoco(throttle.address)"
              @release="handleRelease"
              @change="handleViewChange"
            />
          </div>
        </template>
        <template v-else-if="viewAs === 'Sidebar'">
          <ThrottleComponent                  
            :throttle="currentThrottle" 
            :loco="getLoco(address)"
            :viewAs="viewAs"
            @release="handleRelease"
            @change="handleViewChange"
            class="flex-basis-2/3 w-2/3"
          />
          <div class="flex-grow flex flex-col relative overflow-auto items-center p-2">
            <ThrottleAvatar 
              v-for="throttle in throttles.filter(t => t.address !== address)"
              :key="throttle.id"
              :throttle="throttle" 
              :loco="getLoco(throttle.address)"
              @select="address = throttle.address"
            />
          </div>
        </template>
      </template>
    </div>
    
  </div>
</template>
