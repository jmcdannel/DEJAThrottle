<script async setup lang="ts">
  import { computed, onMounted, watch, shallowRef, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { computedAsync } from '@vueuse/core'
  import { useDocument, useCollection, firestoreDefaultConverter } from 'vuefire'
  import router from '../router'

  import ThrottleComponent from '@/throttle/Throttle.component.vue'
  import ThrottleArrayNavItem from '@/throttle/ThrottleArrayNavItem.vue'

  import { useDejaCloud } from '@/deja-cloud/useDejaCloud'

  const route = useRoute()
  const carouselElement = ref(null)
  const { acquireThrottle, releaseThrottle, getLocoByAddress, getThrottles, getLocos } = useDejaCloud()


  const viewAs = ref('Array')

  const address = ref(parseInt(route.params.address?.toString()))
  const throttles = getThrottles()
  const locos = getLocos()
  // const selectedThrottle = shallowRef(acquireThrottle(address.value))
  // const loco = shallowRef(null)
  // const selectedThrottleIdx = ref(throttles?.value.findIndex((throttle) => throttle.id === selectedThrottle?.value?.id))
  

  onMounted(async () => {
    // loco.value = await getLocoByAddress(address.value)
    // selectedThrottleIdx.value = throttles?.value.findIndex((throttle) => throttle.id === selectedThrottle?.value?.id)
    const throttleIdx = throttles?.value.findIndex((throttle) => throttle.address === address.value)
    console.log('onMounted address', address.value, throttleIdx)
    scrollCarousel(throttleIdx)
  })

  async function getData() {
  // const selectedThrottle = computed(() =>  acquireThrottle(address.value))
  // const loco = computed(() => getLocoByAddress(address.value))

  }
  watch(
    () => route.params.address,
    (newId, oldId) => {
      console.log('watch oute.params.address', newId, oldId)
      address.value = parseInt(newId?.toString())
    }
  )

  watch(address, async (newAddress, oldAddress) => {
    const throttleIdx = throttles?.value.findIndex((throttle) => throttle.address === newAddress)
    console.log('watch addres', newAddress, oldAddress, throttleIdx)
    scrollCarousel(throttleIdx)
    // selectedThrottle.value = acquireThrottle(newAddress)
    // loco.value = await getLocoByAddress(newAddress)
    // selectedThrottleIdx.value = throttles?.value.findIndex((throttle) => throttle.id === selectedThrottle?.value?.id)
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
      'w-full': viewAs.value === 'Array' || viewAs.value === 'Carousel',
      'w-1/2': viewAs.value === '2up'
    }
  })
  console.log('cloud throttles', throttles, locos)


</script>

<template>
  <template v-if="locos?.length  && throttles?.length">
    <div 
      class="carousel w-full"
      :class="viewAs === 'Carousel' ? ' space-x-4 px-16' : ''"
      ref="carouselElement">
      <div 
        :class="itemClasses"
        v-for="(throttle, index) in throttles"   
        :id="`slide${index.toString()}`"
        :key="throttle.id">
        <ThrottleComponent                  
          :throttle="throttle" 
          :loco="getLoco(throttle.address)"
          @release="handleRelease"
          @change="handleViewChange"
        />
        <div v-if="viewAs !== '2up'" class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
          <button @click="scrollCarousel(index-1)" class="btn btn-circle" :class="index > 0 ? 'visible' : 'invisible'">{{ throttles?.[index-1]?.address }}</button>
          <button @click="scrollCarousel(index+1)" class="btn btn-circle" :class="index < throttles.length-1 ? 'visible' : 'invisible'">{{ throttles?.[index+1]?.address }}</button>
        </div>
      </div>
    </div>
    <!-- <div>
      <pre>selectedThrottleIdx:{{  selectedThrottleIdx }}</pre>
      <pre>locos: {{  locos }}</pre>
      <pre>throttles: {{  throttles }}</pre>
    </div> -->
  </template>


  <!-- <template 
    v-for="(throttle, index) in throttles"
    :key="throttle.id"
  >
    <template v-if="selectedThrottle && throttle?.id === selectedThrottle.id">
      
    </template>
    <template v-else>
      <div 
        class="p-4 flex border-teal-500 bg-teal-900 bg-opacity-25 h-32 my-auto border-t border-b"
        :class="computedLinkClass(index)">
        <router-link
            :to="`/cloud-throttle/${throttle?.id}`"
            custom
            v-slot="{ navigate }"
          >
          <button 
            class="text-primary" 
            @click="navigate" 
            style="--va-badge-text-wrapper-border-radius: 50%;"
            role="link">
            <VaBadge
              overlap
              :text="throttle.speed.toString()"
            >
              <VaAvatar size="small">{{ throttle?.id }}</VaAvatar>
            </VaBadge>
          </button>
        </router-link>
      </div>
    </template> -->
  <!-- </template> -->
<!-- 
  <router-link
      v-for="throttle in throttles"
        :key="throttle.id"
        :to="`/cloud-throttle/${throttle?.id}`"
        custom
        v-slot="{ navigate }"
      >
      <button 
        class="text-primary" 
        :class="{ active: ($route?.name === 'home' || $route?.name === 'throttle') }" 
        @click="navigate" 
        style="--va-badge-text-wrapper-border-radius: 50%;"
        role="link">
        <VaBadge
          overlap
          :text="throttle.speed.toString()"
        >
          <VaAvatar size="small">{{ throttle?.id }}</VaAvatar>
        </VaBadge>
      </button>
    </router-link> -->
</template>
