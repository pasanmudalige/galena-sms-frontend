import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { getAccessToken, removeAccessToken } from 'src/utils/cookie-storage'

// Common headers setup
const commonHeaders = () => {
  const accessToken = getAccessToken()
  return {
    'Access-Control-Allow-Origin': '*',
    'Content-Security-Policy': "default-src 'self'",
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000',
    'Access-Control-Allow-Credentials': true,
    Authorization: `Bearer ${accessToken}`,
  }
}

// Common response interceptor
const responseInterceptor = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 307: // inactive user
      case 401: // Not logged in
      case 419: // Session expired
        logout()
        break
      case 503: // Down for maintenance
        location.replace('/')
        // router.push('/maintenance')
        break
      case 500:
        return Promise.reject(error)
      default:
        return Promise.reject(error)
    }
  } else {
    console.error('ERROR : ' + error.message)
  }
}

// Create an Axios instance with default settings
const createApiInstance = (contentType = 'application/json') => {
  const apiInstance = axios.create({
    baseURL: process.env.BACKEND_URL,
    withCredentials: true,
  })

  apiInstance.interceptors.request.use((config) => {
    config.headers = {
      ...config.headers,
      'Content-Type': contentType,
      ...commonHeaders(),
    }
    config.withCredentials = true
    return config
  })

  apiInstance.interceptors.response.use(
    (response) => Promise.resolve(response),
    responseInterceptor,
  )

  return apiInstance
}
const logout = () => {
  removeAccessToken()
  localStorage.clear()
  sessionStorage.clear()
  window.location.replace('/login')
}

// Create instances for JSON and Multipart/Form-Data requests
const api = createApiInstance('application/json')
const apiFiles = createApiInstance('multipart/form-data')

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$apiFiles = apiFiles
})

export { api, apiFiles }
