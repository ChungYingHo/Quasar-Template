<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click="switchComponent">Switch to {{ switchComponentName }}</q-btn>
    <div>
      <component :is="switchComponentName === 'Filter & Export' ? HandsonTableCrudComponent : HandsonTableComponent" ref="componentRef" />
      <q-btn
        v-if="switchComponentName === 'CRUD'"
        color="warning"
        class="q-mt-sm row"
        @click="exportToCsv"
      >
        Export
      </q-btn>
    </div>
</q-page>
</template>

<script setup lang="ts">
import HandsonTableComponent from 'src/components/handsontable/HandsonTableComponent.vue'
import HandsonTableCrudComponent from 'src/components/handsontable/HandsonTableCrudComponent.vue'
import { ref } from 'vue'

import type { ComponentPublicInstance } from 'vue'

interface ExportableComponent extends ComponentPublicInstance {
  exportToCsv: () => void
}

const componentRef = ref<ExportableComponent | null>(null)
const switchComponentName = ref('Filter & Export')

const switchComponent = () => {
  if (switchComponentName.value === 'Filter & Export') {
    switchComponentName.value = 'CRUD'
  } else {
    switchComponentName.value = 'Filter & Export'
  }
}

const exportToCsv = () => {
  if (switchComponentName.value === 'CRUD') {
    if (componentRef.value) {
      componentRef.value.exportToCsv()
    }
  }
}
</script>
