import { defineStore } from 'pinia'
import { User } from 'src/components/models'
import { ref } from 'vue'

export const useDialogStore = defineStore('dialog', () => {
  const actionType = ref<'add' | 'edit' | 'delete'>('add')
  const userData = ref<User>({
    id: 0,
    firstName: '',
    lastName: '',
    age: 0,
    gender: ''
  })

  return {
    actionType,
    userData
  }
})
