<template>
  <div class="container q-pa-md">
    <q-table
      v-model:pagination="pagination"
      binary-state-sort
      title="Homework"
      row-key="id"
      class="table"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
    >
<!-- search and add user -->
      <template v-slot:top-right>
        <q-input v-model="filter" borderless dense debounce="300" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn round icon="add" color="secondary" class="q-ml-lg" @click="handleDialogAction('add')" />
      </template>

      <!-- edit and delete user -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense icon="edit" color="warning" @click="handleDialogAction('edit', props.row)" />
          <q-btn flat dense icon="delete" color="pink-7" @click="handleDialogAction('delete', props.row)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { QTableColumn } from 'quasar'
import { useQuasar } from 'quasar'
import { User, ApiParams } from 'src/components/models'
import EditDialog from 'src/components/quasar-table/EditDialog.vue'
import { errorHandler } from 'src/composables/errorHandler'
import { getUsers, deleteUser } from 'src/service/api'
import { useDialogStore } from 'src/stores/dialogStore'
import { ref, onMounted } from 'vue'

const columns: QTableColumn<Partial<User>>[] = [
  {
    name: 'firstName',
    required: true,
    align: 'left',
    label: 'Name',
    field: (row) => `${row?.firstName} ${row.lastName}`,
    sortable: true
  },
  {
    name: 'age',
    align: 'center',
    label: 'Age',
    field: 'age',
    sortable: true
  },
  {
    name: 'gender',
    align: 'center',
    label: 'Gender',
    field: 'gender',
    sortable: true
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Actions',
    field: (row) => row.actions,
    sortable: false
  }
]

const $q = useQuasar()
// pinia store
const store = useDialogStore()
const { actionType, userData } = storeToRefs(store)

// q-table rows, filter, loading, pagination
const rows = ref<Partial<User>[]>([])
const filter = ref('')
const loading = ref(false)
const pagination = ref({
  sortBy: 'firstName',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

// q-table request data from server when pagination, filter, sort changed
const onRequest = async (props: { pagination: { page: number; rowsPerPage: number; sortBy: string; descending: boolean; }; filter?: string | unknown; }) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filter = props.filter

  loading.value = true

  try {
    const params: ApiParams = {
      search: filter,
      limit: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      sortBy,
      order: descending
    }

    const response = await getUsers(params)
    const users = response?.users
    const total = response?.total

    rows.value = users
    pagination.value.rowsNumber = total

    // update local pagination object
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
  } catch (error) {
    errorHandler(error)
  } finally {
    loading.value = false
  }
}
// control dialog open/close and store user data
const handleDialogAction = (action: 'add' | 'edit' | 'delete', user?: User) => {
  actionType.value = action

  userData.value = {
    id: user?.id || 0,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || 0,
    gender: user?.gender || ''
  }

  if (action !== 'delete') {
    // dialog for add or edit user
    $q.dialog({
      component: EditDialog
    })
  } else {
    // dialog for delete user
    $q.dialog({
      title: 'Delete User',
      message: `Are you sure you want to delete ${userData.value.firstName} ${userData.value.lastName}?`,
      ok: 'Yes',
      cancel: 'No',
      persistent: true
    }).onOk(async () => {
      try {
        const deletedUser = await deleteUser(userData.value.id)
        $q.notify({
          color: 'lime-6',
          textColor: 'white',
          icon: 'delete',
          message: `User ${deletedUser.firstName} ${deletedUser.lastName} delete successfully`
        })
      } catch (error) {
        errorHandler(error)
      }
    }).onCancel(() => {
      $q.notify({
        color: 'red-6',
        textColor: 'white',
        icon: 'cancel',
        message: 'User delete canceled'
      })
    })
  }
}

// get initial data when component mounted
onMounted(async () => {
  try {
    loading.value = true

    const params: ApiParams = {
      limit: 5,
      skip: 0
    }

    const response = await getUsers(params)
    const users = response?.users
    const total = response?.total

    rows.value = users
    pagination.value.rowsNumber = total
  } catch (error) {
    errorHandler(error)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table {
  width: 60%;
}
</style>
