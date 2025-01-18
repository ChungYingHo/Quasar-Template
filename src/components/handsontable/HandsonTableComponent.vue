<template>
  <div>
    <div class="row">
      Current select data: {{ selectedData }}
    </div>
    <q-btn
      class="q-mb-sm row"
      color="primary"
      @click="filterPastTwoYears"
    >
      2022 ~ 2024
    </q-btn>
    <q-btn
      class="q-mb-sm row"
      color="secondary"
      @click="clearFilters"
    >
      Clear filters
    </q-btn>

    <q-input
      v-model="searchWord"
      outlined
      dense
      label="Search"
      placeholder="Search..."
      class="q-mb-sm row"
    />
    <HotTable
      ref="hotTable"
      col-widths="100px"
      row-heights="30px"
      filters="true"
      license-key="non-commercial-and-evaluation"
      :data="data"
      :columns="columns"
      :col-headers="colHeaders"
      :dropdown-menu="dropdownMenu"
      :settings="hotTableOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { HotTable } from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { useQuasar } from 'quasar'
import { ref, watch } from 'vue'
import 'handsontable/dist/handsontable.full.css'

// HotTable settings
const data = [
  { year: 2021, airport: 'Airport A', isCheck: true, url: 'http://Airport_A' },
  { year: 2022, airport: 'Airport B', isCheck: false, url: 'http://Airport_B' },
  { year: 2022, airport: 'Airport C', isCheck: true, url: 'http://Airport_C' },
  { year: 2023, airport: 'Airport D', isCheck: false, url: 'http://Airport_D' },
  { year: 2023, airport: 'Airport E', isCheck: true, url: '' },
  { year: 2024, airport: 'Airport F', isCheck: false, url: '' },
  { year: 2024, airport: 'Airport G', isCheck: true, url: '' },
  { year: 2020, airport: 'Airport H', isCheck: false },
  { year: 2019, airport: 'Airport I', isCheck: true },
  { year: 2018, airport: 'Airport J', isCheck: false }
]

const colHeaders = [
  'Year',
  'Airport',
  'Checkbox',
  'Button'
]

const columns = [
  {
    data: 'year',
    readOnly: true
  },
  {
    data: 'airport',
    readOnly: true
  },
  {
    data: 'isCheck',
    type: 'checkbox'
  },
  {
    readOnly: true,
    renderer: createBtn
  }
]

const dropdownMenu = {
  items: {
    filter_by_value: {
      hidden () {
        const selectedCol = hotTable.value.hotInstance.getSelectedRangeLast()!.to.col
        return selectedCol !== 0 && selectedCol !== 2
      }
    },
    filter_action_bar: {
      hidden () {
        const selectedCol = hotTable.value.hotInstance.getSelectedRangeLast()!.to.col
        return selectedCol !== 0 && selectedCol !== 2
      }
    }
  }
}

const hotTableOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterGetColHeader: (col: number, TH: { querySelector: (arg0: string) => any; }) => {
    if (col !== 0 && col !== 2) {
      const button = TH.querySelector('.changeType')

      if (!button) {
        return
      }

      button.parentElement.removeChild(button)
    }
  }
}

const $q = useQuasar()

// register Handsontable's modules
registerAllModules()

// HotTable instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hotTable = ref<any>(null)

const searchWord = ref('')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedData = ref<any>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createBtn (instance: any, td: any, row: any) {
  const rowData = instance.getSourceDataAtRow(row)
  const link = rowData.url

  if (link) {
    td.innerHTML = '<button class="dialog-btn"><i class="material-icons">open_in_new</i></button>'
  } else {
    td.innerHTML = '<button class="dialog-btn" disabled><i class="material-icons">open_in_new</i></button>'
  }

  td.querySelector('.dialog-btn')?.addEventListener('click', () => {
    if (link) {
      openLink(link)
    }
  })
}

const openLink = (link: string) => {
  $q.dialog({
    title: 'Link',
    message: link
  })
}

const filterPastTwoYears = () => {
  if (hotTable.value) {
    const filters = hotTable.value.hotInstance.getPlugin('filters')
    const columnToFilter = 0

    filters.removeConditions(columnToFilter)
    filters.addCondition(columnToFilter, 'gte', [new Date().getFullYear() - 2])
    filters.filter()
  }
}

const clearFilters = () => {
  if (hotTable.value) {
    const filters = hotTable.value.hotInstance.getPlugin('filters')
    filters.clearConditions()
    filters.filter()
  }
}

const exportToCsv = () => {
  const hotInstance = hotTable.value.hotInstance

  const exportPlugin = hotInstance.getPlugin('exportFile')

  exportPlugin.downloadFile('csv', {
    bom: false,
    columnDelimiter: ',',
    columnHeaders: true,
    exportHiddenColumns: true,
    exportHiddenRows: true,
    fileExtension: 'csv',
    filename: 'PNR_DATA_[YYYY]-[MM]-[DD]',
    mimeType: 'text/csv',
    rowDelimiter: '\r\n',
    rowHeaders: true
  })
}

watch(searchWord, (newVal) => {
  if (hotTable.value) {
    const filters = hotTable.value.hotInstance.getPlugin('filters')
    const columnToFilter = 0

    filters.removeConditions(columnToFilter)
    filters.addCondition(columnToFilter, 'contains', [newVal])
    filters.filter()
  }
})

watch(() => hotTable.value, (newVal) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newVal.hotInstance.addHook('afterChange', (changes: any, source: any) => {
    if (source === 'edit') {
      const row = changes[0][0]
      // remove the last column because it is a button
      selectedData.value = newVal.hotInstance.getDataAtRow(row).slice(0, -1)
    }
  })

  if (newVal) {
    newVal.hotInstance.addHook('afterSelectionEnd', (r: number) => {
      // remove the last column because it is a button
      selectedData.value = newVal.hotInstance.getDataAtRow(r).slice(0, -1)
    })
  }
})

defineExpose({
  exportToCsv
})
</script>

<style lang="scss" scoped>
:deep(.dialog-btn) {
  border-radius: 5px;
  background-color: lightseagreen;
  color: white;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}
</style>
