/**
 * We are using date-fns for date conversions. DO NOT USE any other 3rd party dependancies
 * https://date-fns.org/docs/Getting-Started
 */

import { format } from 'date-fns'

export function getCurrentDateTime() {
  return new Date()
}

export function getCurrentDateTimeInGivenFormat(requiredFormat = 'yyyy-MM-dd HH:mm:ss') {
  const currentDateTime = new Date()
  return format(currentDateTime, requiredFormat)
}

export function convertGivenDateToGivenFormat(date, requiredFormat = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) {
    return ''
  }
  const originalDate = new Date(date)
  return format(originalDate, requiredFormat)
}
