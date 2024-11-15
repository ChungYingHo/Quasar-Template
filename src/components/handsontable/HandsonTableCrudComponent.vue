<template>
  <div>
    <div class="controls q-mb-md">
      <q-btn label="Add" color="secondary" @click="addData" />
      <!-- use q-toggle -->
      <q-toggle v-model="canDelete" label="Delete" color="red" class="q-mx-sm" />
      <q-toggle v-model="canUpdate" label="Update" color="blue" class="q-mr-sm" />
      <!-- switch language -->
      <q-btn label="Switch language" color="primary" @click="switchLanguage" />
    </div>
    <HotTable
      ref="hotTable"
      col-widths="200px"
      row-heights="30px"
      filters="true"
      license-key="non-commercial-and-evaluation"
      column-sorting=true
      :data="data"
      :columns="columns"
      :col-headers="colHeaders"
    />
  </div>
</template>

<script setup lang="ts">
import { HotTable } from '@handsontable/vue3'
import Handsontable from 'handsontable'
import { registerAllModules } from 'handsontable/registry'
import { computed, nextTick, ref, watch } from 'vue'
import 'handsontable/dist/handsontable.full.css'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = ref<any>([
  { year: 2021, airport: 'Airport A', price: 100000 },
  { year: 2020, airport: 'Airport B', price: 200000 },
  { year: 2019, airport: 'Airport C', price: 300000 }
])

const colHeaders = computed(() => [
  t('handsontable.year'),
  t('handsontable.airport'),
  t('handsontable.price'),
  t('handsontable.delete'),
  t('handsontable.update')
])

class numberEditor extends Handsontable.editors.TextEditor {
  // 建立 input 框元素，限制只能輸入數字
  createElements () {
    super.createElements()
    this.TEXTAREA.setAttribute('type', 'text')
    this.TEXTAREA.setAttribute('inputmode', 'numeric')
  }

  // 當編輯器啟動時，移除千分位顯示，顯示純數字
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue (value: any) {
    const editNumber = value ? value.toString().replace(/,/g, '') : ''
    super.setValue(editNumber)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns = ref<any>([
  {
    data: 'year',
    readOnly: true
  },
  {
    data: 'airport',
    readOnly: true
  },
  {
    data: 'price',
    type: 'numeric',
    renderer: thousandthPlaceRenderer,
    editor: numberEditor
  },
  {
    readOnly: true,
    renderer: createDeleteButton
  },
  {
    readOnly: true,
    renderer: createUpdateButton
  }
])

// register Handsontable's modules
registerAllModules()

// HotTable instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hotTable = ref<any>(null)

const canDelete = ref(false)
const canUpdate = ref(false)

const addData = () => {
  data.value.unshift({ year: 2019, airport: 'Airport add with unshift' })
  data.value.push({ year: 2020, airport: 'Airport add with push' })
  data.value.splice(2, 0, { year: 2018, airport: 'Airport add with splice' })

  // trigger sorting immediately after adding data
  nextTick(() => {
    const hotInstance = hotTable.value.hotInstance
    const columnSortingPlugin = hotInstance.getPlugin('columnSorting')
    const sortSetting = columnSortingPlugin.getSortConfig()
    columnSortingPlugin.sort(sortSetting)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createDeleteButton (instance: any, td: any, row: any) {
  const btnClass = 'btn-delete'
  const btnLabel = 'Delete'
  const isDisabled = !canDelete.value

  td.innerHTML = `<button class="${btnClass}" ${isDisabled ? 'disabled' : ''}>${btnLabel}</button>`

  td.querySelector(`.${btnClass}`)?.addEventListener('click', () => {
    const instanceData = instance.getData()
    const dataDeletedIndex = data.value.findIndex((item: { airport: string }) => item.airport === instanceData[row][1])
    data.value.splice(dataDeletedIndex, 1)

    nextTick(() => {
      const columnSortingPlugin = instance.getPlugin('columnSorting')
      const sortSetting = columnSortingPlugin.getSortConfig()
      columnSortingPlugin.sort(sortSetting)
    })
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createUpdateButton (instance: any, td: any, row: any) {
  const btnClass = 'btn-update'
  const btnLabel = 'Update'
  const isDisabled = !canUpdate.value

  td.innerHTML = `<button class="${btnClass}" ${isDisabled ? 'disabled' : ''}>${btnLabel}</button>`

  td.querySelector(`.${btnClass}`)?.addEventListener('click', () => {
    const instanceData = instance.getData()
    const dataUpdatedIndex = data.value.findIndex((item: { airport: string }) => item.airport === instanceData[row][1])
    data.value[dataUpdatedIndex].year = 2019
    data.value[dataUpdatedIndex].airport = `update row ${row} airport`

    nextTick(() => {
      const columnSortingPlugin = instance.getPlugin('columnSorting')
      const sortSetting = columnSortingPlugin.getSortConfig()
      columnSortingPlugin.sort(sortSetting)
    })
  })
}

// thousandth place renderer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function thousandthPlaceRenderer (instance: any, td: any, row: any, col: any, prop: any, value: any) {
  td.innerHTML = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
}

function switchLanguage () {
  if (locale.value === 'en-US') {
    locale.value = 'zh-TW'
  } else {
    locale.value = 'en-US'
  }
}

watch([canDelete, canUpdate], () => {
  hotTable.value.hotInstance.render()
})
</script>

<style lang="scss" scoped>
:deep(button) {
  border-radius: 5px;
  color: white;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}

:deep(.btn-delete) {
  background-color: lightpink;
}

:deep(.btn-update) {
  background-color: lightskyblue;
}
</style>
