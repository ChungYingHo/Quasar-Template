<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click="switchComponent">Switch to {{ componentName }}</q-btn>
    <component :is="componentName === 'Default demo' ? HandsonTableCrudComponent : HandsonTableComponent" />
  </q-page>
</template>

<script setup lang="ts">
import HandsonTableComponent from 'src/components/handsontable/HandsonTableComponent.vue'
import HandsonTableCrudComponent from 'src/components/handsontable/HandsonTableCrudComponent.vue'
import { ref } from 'vue'

const componentName = ref('Default demo')

const switchComponent = () => {
  if (componentName.value === 'Default demo') {
    componentName.value = 'CRUD demo'
  } else {
    componentName.value = 'Default demo'
  }
}
</script>
