<script async setup lang="ts">
  import { computed, onMounted, watch, shallowRef, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStorage } from '@vueuse/core'
  import router from '../router'

  import ThrottleComponent from '@/throttle/Throttle.component.vue'
  import ThrottleTile from '@/throttle/ThrottleTile.vue'
  import ThrottleAvatar from '@/throttle/ThrottleAvatar.vue'

  import { useLocos } from '@/api/useLocos'
  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'
  import { defaultFunctions } from '@/functions/useFunctions'

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
    console.log('scrollCarousel', targetImageNumber)
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
      // 'carousel-item': true,
      // 'relative': true,
      // ' w-screen': viewAs.value === 'Array',
      // 'w-1/2': viewAs.value === 'Split'
    }
  })

</script>

<template>
  <!-- <ThrottleMenu /> -->
  <template v-if="locos?.length  && throttles?.length">
    <template v-if="viewAs === 'Array' || viewAs === 'Split'">
      <!-- <section class=" w-full h-full flex flex-row items-center justify-center overflow-auto"> -->
        <div 
          class="carousel w-full"
          ref="carouselElement">
          <div 
            class="carousel-item relative w-screen"
            :class="itemClasses"
            v-for="(throttle, index) in throttles"   
            :id="`slide${index.toString()}`"
            :key="throttle.id">
            <!-- <div class="bg-zinc-500 rounded-2xl w-full h-full flex flex-col">
              <header class=" bg-zinc-800 text-zinc-100">{{ throttle.id }}</header>
              <section class="throttle w-full flex flex-row flex-grow h-full pt-12 -mt-12">
                <section class="functions bg-amber-950 basis-1/2 sm:basis-1/3 flex flex-col overflow-hidden h-full">
                  <div class=" bg-lime-950 h-full overflow-y-auto">
                    <button class="btn btn-lg">F0</button>
                    <button class="btn btn-lg">F1</button>
                    <button class="btn btn-md block" v-for="func in defaultFunctions" :key="func.id">{{ func.label}}</button>
                  </div>
                </section>
                <section class="speed bg-orange-950 basis-1/2 sm:basis-1/3">                
                  <section class=" bg-slate-500 rounded-2xl p-2 w-full">
                    <button class="btn btn-lg">Up</button>
                  </section>
                  <section class=" bg-slate-500 rounded-2xl p-2 w-full">
                    <button class="btn btn-lg">Stop</button>
                  </section>
                  <section class=" bg-slate-500 rounded-2xl p-2 w-full">
                    <button class="btn btn-lg">Down</button>
                  </section>
                </section>
              </section>

            </div> -->
            <ThrottleComponent
              :throttle="throttle" 
              :loco="getLoco(throttle.address)"
              :viewAs="viewAs"
              @release="handleRelease"
            />
            <!-- <template v-if="viewAs !== 'Split'">
              <button @click="scrollCarousel(index-1)" class="btn btn-circle absolute left-2 top-2/3 -translate-y-1/2 transform z-10" :class="index > 0 ? 'visible' : 'invisible'">{{ throttles?.[index-1]?.address }}</button>
              <button @click="scrollCarousel(index+1)" class="btn btn-circle absolute right-2 top-2/3 -translate-y-1/2 transform z-10" :class="index < throttles.length-1 ? 'visible' : 'invisible'">{{ throttles?.[index+1]?.address }}</button>
            </template> -->
          </div>
        </div>
      <!-- </section> -->
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
        />
      </div>
    </template>
  </template>
</template>
