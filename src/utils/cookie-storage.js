import Cookies from 'js-cookie'

// expires in 1 day
export function setAccessToken(accessToken) {
  return Cookies.set('mobibleToken', accessToken, { expires: 1 })
}

export function getAccessToken() {
  return Cookies.get('mobibleToken')
}

export function removeAccessToken() {
  return Cookies.remove('mobibleToken')
}
