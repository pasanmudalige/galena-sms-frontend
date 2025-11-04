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
        return await api.get('/api/auth/get-user-data')
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
      const response = await api.get('/api/admin/privilege/get-access')
      const routes = response.data.data
      // const routes = [
      //   {
      //     id: 'dashboard',
      //     title: 'Dashboard',
      //     icon: 'home',
      //     route: '/admin/dashboard'
      //   },
      //   {
      //     id: 'bible-verse-english',
      //     title: 'English Message',
      //     icon: 'menu_book',
      //     route: '/admin/bible-verse/english'
      //   },
      //   {
      //     id: 'bible-verse-sinhala',
      //     title: 'Sinhala Message',
      //     icon: 'menu_book',
      //     route: '/admin/bible-verse/sinhala'
      //   },
      //   {
      //     id: 'bible-verse-tamil',
      //     title: 'Tamil Message',
      //     icon: 'menu_book',
      //     route: '/admin/bible-verse/tamil'
      //   },
      //   {
      //     id: 'users',
      //     title: 'User List',
      //     icon: 'person',
      //     route: '/admin/users'
      //   },
      //   {
      //     id: 'users',
      //     title: 'News',
      //     icon: 'person',
      //     route: '/admin/news'
      //   }
      // ]
      // if (this.auth.view === 'SUPER_ADMIN_VIEW') {
      //   routes.push({
      //     id: 'admins',
      //     title: 'Admin List',
      //     icon: 'admin_panel_settings',
      //     route: '/admin/admins'
      //   })
      // }

      return routes
    },
  },
})
