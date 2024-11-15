import { Notify } from 'quasar'

export const errorHandler = (error: unknown) => {
  let msg = ''

  if (error instanceof Error) {
    msg = error.message
  } else if (typeof error === 'string') {
    msg = error
  } else if (typeof error === 'object') {
    msg = (error as { message?: string }).message || JSON.stringify(error)
  } else {
    msg = 'An unknown error occurred.'
  }

  Notify.create({
    type: 'negative',
    message: msg
  })
}
