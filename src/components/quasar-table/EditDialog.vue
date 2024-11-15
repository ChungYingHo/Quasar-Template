<template>
  <q-dialog ref="dialogRef">
      <q-card class="card">
        <q-card-section>
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            class="q-gutter-md"
            @submit="onSubmit"
            @reset="onReset"
          >
            <q-input
              v-model="userData.firstName"
              lazy-rules
              label="First Name"
              :rules="[ val => val && val.length > 0 || 'Please type your first name' ]"
            />
            <q-input
              v-model="userData.lastName"
              lazy-rules
              label="Last Name"
              :rules="[ val => val && val.length > 0 || 'Please type your last name' ]"
            />
            <q-input
              v-model="userData.age"
              lazy-rules
              type="number"
              label="Age"
              :rules="[
                val => val !== null && val !== '' || 'Please type your age',
                val => val > 0 && val < 100 || 'Please type a real age'
              ]"
            />
            <q-select
              v-model="selectedOption"
              lazy-rules
              label="Gender"
              :options="options"
              :rules="[ val => val.value !== '' || 'Please select your gender']"
            />
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn flat label="Reset" type="reset" color="primary" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { errorHandler } from 'src/composables/errorHandler'
import { addUser, updateUser } from 'src/service/api'
import { useDialogStore } from 'src/stores/dialogStore'
import { computed, onMounted, ref } from 'vue'

defineEmits([...useDialogPluginComponent.emits])

// q-select object options
const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
]

const $q = useQuasar()
const { dialogRef, onDialogOK } = useDialogPluginComponent()
// pinia store
const store = useDialogStore()
const { actionType, userData } = storeToRefs(store)

// store the selected option
const selectedOption = ref({
  label: '',
  value: ''
})

// dialog title
const dialogTitle = computed(() => {
  if (actionType.value === 'add') {
    return 'Add User'
  } else if (actionType.value === 'edit') {
    return 'Edit User'
  } else {
    return 'Delete User'
  }
})

// submit the form
const onSubmit = async () => {
  userData.value.gender = selectedOption.value.value

  let response

  try {
    if (actionType.value === 'add') {
      response = await addUser(userData.value)
    } else {
      response = await updateUser(userData.value.id, userData.value)
    }
    $q.notify({
      color: `${actionType.value === 'add' ? 'green-4' : 'blue-4'}`,
      textColor: 'white',
      icon: 'cloud_done',
      message: `You ${actionType.value} a user name is ${response.firstName} ${response.lastName}, and age is ${response.age}, gender is ${response.gender}`
    })
  } catch (error) {
    errorHandler(error)
  } finally {
    onDialogOK()
  }
}
// reset the form
const onReset = () => {
  userData.value.firstName = ''
  userData.value.lastName = ''
  userData.value.age = 0
  userData.value.gender = ''
  selectedOption.value = { label: '', value: '' }
}

// get initial gender value
onMounted(() => {
  if (userData.value.gender) {
    let matchedOption = { label: '', value: '' }

    options.forEach(option => {
      if (option.value === userData.value.gender) {
        matchedOption = option
      }
    })

    selectedOption.value = matchedOption
  }
})
</script>

<style lang="scss" scoped>
.card {
  width: 600px;
}
</style>
