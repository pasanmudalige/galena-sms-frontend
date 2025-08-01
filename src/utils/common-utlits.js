/**
 * Function for capitalize first letter only
 * @param {String} str
 * @returns String
 */
export function capitalizeFirstLetter (str) {
  if (str.length === 0) return str // Handle empty string

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * This function will truncate long text to 100 caracters and will add ... end of it
 * @param {String} text
 * @param {Number} maxLength
 * @returns String ...
 */
export function truncateText (text, maxLength = 100) {
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength) + '...'
}

export function removeObjectById (array, id) {
  return array.filter(item => item.id !== id)
}

export function getFirstLetterOfString (str) {
  if (!str) {
    return ''
  }
  const firstLetter = str.charAt(0)
  return firstLetter.toUpperCase() + firstLetter.slice(1)
}
export function truncateHTML (html, length = 100) {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  const textContent = tempDiv.textContent || tempDiv.innerText || ''
  const truncatedText = textContent.length > length
    ? textContent.substring(0, length) + '...'
    : textContent
  tempDiv.innerHTML = truncatedText
  return tempDiv.innerHTML
}
