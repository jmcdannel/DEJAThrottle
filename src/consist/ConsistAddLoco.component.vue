<script lang="ts" setup>
  import { ref } from 'vue';
  import Modal from '@/core/Modal.component.vue'
  import DejaCloudRoster from '@/deja-cloud/DejaCloudRoster.vue'

  const emit = defineEmits(['addLoco'])
  
  const modalRef = ref<HTMLDialogElement | null>(null);

  defineExpose({
    showModal: () => modalRef?.value?.showModal()
  })

  function handleLocoSelection(address) {
    emit('addLoco', address)
  }

</script>
<template>
  <Modal ref="modalRef">
    <h3 class="text-lg font-bold">Loco Address</h3>
    <hr class="my-2 border-slate-500" />
    <DejaCloudRoster :allowAdd="false" :showHeader="false" @selected="handleLocoSelection" />
  </Modal>
</template>