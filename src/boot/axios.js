import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { getAccessToken, removeAccessToken } from 'src/utils/cookie-storage'

// Common headers setup
const commonHeaders = () => {
  const accessToken = getAccessToken()
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

// Common response interceptor
const responseInterceptor = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 307: // inactive user
      case 401: // Not logged in
      case 419: // Session expired
        logout()
        return Promise.reject(error)
      case 503: // Down for maintenance
        location.replace('/')
        return Promise.reject(error)
    }
  } else {
    console.error('ERROR : ' + error.message)
  }

  return Promise.reject(error)
}

const configuredBaseUrl = process.env.BACKEND_URL?.trim().replace(/\/$/, '')
const defaultBaseUrl =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:8080/v1/api'
    : 'https://api.galena.lk/v1/api'

// Create an Axios instance with default settings
const createApiInstance = (contentType = 'application/json') => {
  const apiInstance = axios.create({
    baseURL: configuredBaseUrl || defaultBaseUrl,
    withCredentials: true,
    timeout: 30000,
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
  window.location.replace('/#/login')
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
