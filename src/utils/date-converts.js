/**
 * Date conversion utilities using native JavaScript Date methods
 */

export function getCurrentDateTime() {
  return new Date()
}

// Format time to 12H format with AM/PM
export function formatTime12H(dateTimeString) {
  if (!dateTimeString) return 'N/A'
  try {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch (e) {
    console.log(e)
    return dateTimeString
  }
}

// Format date and time to 12H format with AM/PM
export function formatDateTime12H(dateTimeString) {
  if (!dateTimeString) return 'N/A'
  try {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch (e) {
    console.log(e)
    return dateTimeString
  }
}

export function getCurrentDateTimeInGivenFormat(requiredFormat = 'yyyy-MM-dd HH:mm:ss') {
  const currentDateTime = new Date()
  return formatDate(currentDateTime, requiredFormat)
}

export function convertGivenDateToGivenFormat(date, requiredFormat = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) {
    return ''
  }
  const originalDate = new Date(date)
  return formatDate(originalDate, requiredFormat)
}

// Helper function to format date according to format string
function formatDate(date, format) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
