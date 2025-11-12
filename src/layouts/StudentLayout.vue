<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" class="q-mr-sm" />
        <q-toolbar-title>
          <div class="flex items-center gap-2">
            <img src="~assets/galena.png" alt="Logo" style="height: 40px" />
            <span class="text-lg font-semibold">Student Portal</span>
          </div>
        </q-toolbar-title>
        <q-space />
        <div class="flex items-center gap-3">
          <div class="text-sm">{{ authUser?.full_name || 'Student' }}</div>
          <q-btn flat round dense icon="logout" @click="handleLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list>
          <q-item class="py-6 justify-center">
            <q-item-section class="items-center">
              <img alt="Galena logo" src="~assets/galena.png" width="180" />
            </q-item-section>
          </q-item>

          <q-item-label header class="text-grey-8">Menu</q-item-label>
          <q-item
            v-for="item in menuItems"
            :key="item.id"
            clickable
            v-ripple
            :to="item.route"
            :active="$route.path === item.route"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { showSuccessNotification } from 'src/utils/notification'

defineOptions({
  name: 'StudentLayout',
})

const authStore = useAuthStore()
const drawer = ref(true)
const authUser = ref(null)

const menuItems = ref([
  { id: 'dashboard', title: 'Dashboard', icon: 'home', route: '/student/dashboard' },
  { id: 'classes', title: 'My Classes', icon: 'school', route: '/student/classes' },
  { id: 'attendance', title: 'My Attendance', icon: 'how_to_reg', route: '/student/attendance' },
  { id: 'payments', title: 'My Payments', icon: 'payments', route: '/student/payments' },
  { id: 'profile', title: 'My Profile', icon: 'person', route: '/student/profile' },
])

const handleLogout = async () => {
  await authStore.logoutApi()
  showSuccessNotification('Logged out successfully')
}

const loadUserData = async () => {
  try {
    const res = await authStore.getAuthUserDataUsingAccessToken()
    if (res.status === 200 && res.data?.data) {
      authUser.value = res.data.data
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

onMounted(() => {
  loadUserData()
})
</script>

