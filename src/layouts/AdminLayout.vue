<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-dark p-4">
      <q-toolbar>
        <q-toolbar-title class="mbi-title">
          {{ headerTitle }}
        </q-toolbar-title>
        <!-- Avatar for profile -->
        <q-avatar color="secondary" text-color="white" class="cursor-pointer m-auto">
          {{ getFirstLetterOfString(authStore.authUser?.fullname) }}
          <q-popup-proxy class="shadow-xl border rounded-md" ref="avatarPopup">
            <q-list style="min-width: 150px">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar color="secondary" text-color="white">
                    {{ getFirstLetterOfString(authStore.authUser?.fullname) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  {{ authStore.authUser?.fullname }}
                  <div class="text-xs text-gray-400">
                    {{ authStore.authUser?.email }}
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="authStore.logoutApi()">
                <q-item-section avatar>
                  <q-avatar color="white" text-color="primary" icon="logout" />
                </q-item-section>

                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-popup-proxy>
        </q-avatar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" class="mobile-only" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :mini="!drawer || miniState"
      :width="220"
      :breakpoint="600"
      class="bg-secondary text-white"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <q-list role="list">
          <q-item class="py-6">
            <q-item-section class="items-center mx-2" avatar>
              <img alt="Mobible logo" src="~assets/logo-v2.svg" width="80" />
            </q-item-section>
          </q-item>

          <DashboardLink
            v-for="route in dashboardRoutesList"
            :key="route.title"
            v-bind="route"
            @dashboardLinkClicked="dashboardLinkClicked"
          />
        </q-list>
      </q-scroll-area>

      <div class="absolute mobile-hide" style="bottom: 15px; right: -15px">
        <q-btn
          dense
          unelevated
          color="white"
          :icon="miniState ? 'chevron_right' : 'chevron_left'"
          @click="miniState = !miniState"
          text-color="primary"
          class="rounded-md"
          :aria-label="miniState ? 'Expand' : 'Collapse'"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import DashboardLink from 'components/admin/DashboardLink.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { getFirstLetterOfString } from 'src/utils/common-utlits'

defineOptions({
  name: 'AdminLayout',
})

const router = useRouter()
const dashboardRoutesList = ref([])
const headerTitle = ref('')
const authStore = useAuthStore()
const miniState = ref(false)
const drawer = ref(true)

const dashboardLinkClicked = async (dashboardRoute) => {
  const { route, title } = dashboardRoute
  router.push(route)
  headerTitle.value = title
}

const getAdminData = async () => {
  try {
    const response = await authStore.getAuthUserDataUsingAccessToken()

    if (response.status === 200) {
      authStore.authUser = response.data.data

      dashboardRoutesList.value = await authStore.adminDashboardRouteBuild()
      headerTitle.value = dashboardRoutesList.value[0].title
    }
  } catch (error) {
    console.error(error)
  }
}

onBeforeMount(() => {
  getAdminData()
})
</script>
