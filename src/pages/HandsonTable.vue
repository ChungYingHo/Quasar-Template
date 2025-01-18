<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click="switchComponent">Switch to {{ switchComponentName }}</q-btn>
    <component :is="switchComponentName === 'Filter & Export' ? HandsonTableCrudComponent : HandsonTableComponent" />
  </q-page>
</template>

<script setup lang="ts">
import HandsonTableComponent from 'src/components/handsontable/HandsonTableComponent.vue'
import HandsonTableCrudComponent from 'src/components/handsontable/HandsonTableCrudComponent.vue'
import { ref } from 'vue'

const switchComponentName = ref('Filter & Export')

const switchComponent = () => {
  if (switchComponentName.value === 'Filter & Export') {
    switchComponentName.value = 'CRUD'
  } else {
    switchComponentName.value = 'Filter & Export'
  }
}
</script>
