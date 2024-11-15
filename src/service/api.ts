import { api } from 'src/boot/axios'
import { User, ApiParams } from 'src/components/models'
import { errorHandler } from 'src/composables/errorHandler'

// NOTE only get user's firstName,lastName,age,gender,email,phone,id in this project
const buildUrl = (searchParams: ApiParams) => {
  const { search, limit, skip, sortBy, order } = searchParams
  const url = search ? '/search' : '/'
  const params: {[key: string]: unknown} = {
    select: 'firstName,lastName,age,gender,email,phone,id',
    q: search ?? undefined,
    limit: limit ?? undefined,
    skip: skip ?? undefined,
    sortBy: sortBy ?? undefined,
    order: order ? 'desc' : 'asc'
  }

  return { url, params }
}

// get users
export const getUsers = async (searchParams: ApiParams) => {
  try {
    const { url, params } = buildUrl(searchParams)

    const response = await api.get(url, { params })
    const users = response.data.users
    const total = response.data.total

    return { users, total }
  } catch (error) {
    errorHandler(error)
  }
}

// add user
export const addUser = async (user: User) => {
  try {
    const response = await api.post('/add', user)

    return response.data
  } catch (error) {
    errorHandler(error)
  }
}

// update user
export const updateUser = async (id: number, user: User) => {
  try {
    const response = await api.put(`/${id}`, user)

    return response.data
  } catch (error) {
    errorHandler(error)
  }
}

// delete user
export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/${id}`)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}
