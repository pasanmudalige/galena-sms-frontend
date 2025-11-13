<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" class="q-mr-sm" />
        <q-toolbar-title>
          <div class="flex items-center gap-2 cursor-pointer" @click="navigateToDashboard">
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
          <q-item class="py-6 justify-center cursor-pointer" @click="navigateToDashboard">
            <q-item-section class="items-center">
              <img alt="Galena logo" src="~assets/galena.png" width="180" />
            </q-item-section>
          </q-item>

          <q-item
            v-for="item in menuItems"
            :key="item.id"
            clickable
            v-ripple
            :to="item.route"
            :active="$route.path === item.route"
            active-class="bg-primary text-white"
            :class="{ 'menu-item-dim': item.isUnderDevelopment }"
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
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { showSuccessNotification } from 'src/utils/notification'

defineOptions({
  name: 'StudentLayout',
})

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(true)
const authUser = ref(null)

const menuItems = ref([
  { id: 'dashboard', title: 'Dashboard', icon: 'home', route: '/student/dashboard', isUnderDevelopment: false },
  { id: 'classes', title: 'My Classes', icon: 'school', route: '/student/classes', isUnderDevelopment: false },
  { id: 'documents', title: 'My Documents', icon: 'folder', route: '/student/documents', isUnderDevelopment: false },
  { id: 'attendance', title: 'My Attendance', icon: 'event_available', route: '/student/attendance', isUnderDevelopment: true },
  { id: 'payments', title: 'My Payments', icon: 'payments', route: '/student/payments', isUnderDevelopment: true },
  { id: 'profile', title: 'My Profile', icon: 'person', route: '/student/profile', isUnderDevelopment: false },
])

const navigateToDashboard = () => {
  router.push('/student/dashboard')
  drawer.value = false
}

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

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: opacity 0.2s;
}

.cursor-pointer:hover {
  opacity: 0.8;
}

.menu-item-dim {
  opacity: 0.5;
  transition: opacity 0.2s;
}

.menu-item-dim:hover {
  opacity: 0.7;
}

.menu-item-dim :deep(.q-item__section) {
  opacity: 0.5;
}

.menu-item-dim:hover :deep(.q-item__section) {
  opacity: 0.7;
}
</style>
