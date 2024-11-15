export interface User {
  id: number;
  firstName: string;
  lastName: string
  age: number
  gender: string
  actions?: string
}

export interface ApiParams {
  search?: string | unknown
  limit?: number
  skip?: number
  sortBy?: string
  order?: boolean
}
