import { Notify } from 'quasar'

export function showErrorNotification (message) {
  Notify.create({
    color: 'red-5',
    textColor: 'white',
    icon: 'error',
    message,
    position: 'top'
  })
}

export function showSuccessNotification (message) {
  Notify.create({
    color: 'green-4',
    textColor: 'white',
    icon: 'done',
    message,
    position: 'top'
  })
}

export function showWarningNotification (message) {
  Notify.create({
    color: 'warning',
    textColor: 'black',
    icon: 'warning',
    message,
    position: 'top'
  })
}

export function showInfoNotification (message) {
  Notify.create({
    color: 'info',
    textColor: 'black',
    icon: 'info',
    message,
    position: 'top'
  })
}
