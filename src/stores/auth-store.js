import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { removeAccessToken, setAccessToken } from 'src/utils/cookie-storage'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: {
      uuid: null,
      mainRole: null,
      roles: [],
      view: null,
    },
    forgotPassword: {
      step: 1,
      email: '',
    },
    authUser: null,
  }),
  persist: [
    {
      paths: ['auth', 'forgotPassword'],
      storage: sessionStorage,
    },
  ],

  getters: {},
  actions: {
    async loginApi(data) {
      try {
        return await api.post('/admin/auth/login', data)
      } catch (error) {
        if (error) throw error
      }
    },
    async getAuthUserDataUsingAccessToken() {
      try {
        return await api.get('/admin/auth/get-user-data')
      } catch (error) {
        if (error) throw error
      }
    },
    async logoutApi() {
      try {
        const data = { isWeb: true }
        await api.post('/api/logout', data)
      } catch (error) {
        console.error(error)
      } finally {
        removeAccessToken()
        localStorage.clear()
        sessionStorage.clear()
        window.location.replace('/admin')
      }
    },
    async sendOtpApi(data) {
      try {
        return await api.post('/api/send-otp', data)
      } catch (error) {
        if (error) throw error
      }
    },
    async verifyOtpApi(data) {
      try {
        return await api.post('/api/verify-otp', data)
      } catch (error) {
        if (error) throw error
      }
    },
    async updateAdminPaaswordApi(data) {
      try {
        return await api.post('/api/admin/update-password', data)
      } catch (error) {
        if (error) throw error
      }
    },
    async getUserValidatingDataFromUuidApi(uuid) {
      try {
        return await api.get(`/api/auth/${uuid}/get-uuid-validation`)
      } catch (error) {
        if (error) throw error
      }
    },
    async updateAdminRegisterDataApi(data) {
      try {
        return await api.post('/api/admin/update-admin-data', data)
      } catch (error) {
        if (error) throw error
      }
    },

    setAuthObject(data) {
      const { uuid, accessToken, mainRole, roles, view } = data
      this.auth = {
        uuid,
        mainRole,
        roles,
        view,
      }
      setAccessToken(accessToken)
    },
    async adminDashboardRouteBuild() {
      return [
        { id: 'dashboard', title: 'Dashboard', icon: 'home', route: '/admin/dashboard' },
        { id: 'students', title: 'Manage Students', icon: 'groups', route: '/admin/students' },
        { id: 'classes', title: 'Manage Classes', icon: 'school', route: '/admin/classes' },
        { id: 'payments', title: 'Payments', icon: 'payments', route: '/admin/payments' },
      ]
    },
  },
})
