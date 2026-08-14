<template>
  <q-layout view="hHh Lpr lFf" class="admin-layout">
    <q-header class="admin-header">
      <q-toolbar class="admin-toolbar">
        <q-btn flat round dense icon="menu" class="mobile-menu" @click="drawer = !drawer" />
        <div class="header-copy"><span>Galena administration</span><strong>{{ headerTitle }}</strong></div>
        <q-space />
        <q-btn flat round icon="notifications_none" class="header-action"><q-badge floating rounded color="negative" /></q-btn>
        <div class="admin-user">
          <q-avatar>{{ getFirstLetterOfString(authStore.authUser?.fullname) }}</q-avatar>
          <div class="gt-xs"><strong>{{ authStore.authUser?.fullname || 'Administrator' }}</strong><span>{{ authStore.authUser?.email || 'Admin account' }}</span></div>
          <q-icon name="expand_more" class="gt-xs" />
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 200px">
              <q-item><q-item-section avatar><q-avatar class="popup-avatar">{{ getFirstLetterOfString(authStore.authUser?.fullname) }}</q-avatar></q-item-section><q-item-section><q-item-label>{{ authStore.authUser?.fullname }}</q-item-label><q-item-label caption>{{ authStore.authUser?.email }}</q-item-label></q-item-section></q-item>
              <q-separator />
              <q-item clickable @click="authStore.logoutApi()"><q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section><q-item-section>Log out</q-item-section></q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :mini="miniState" :width="278" :mini-width="82" :breakpoint="850" class="admin-drawer">
      <div class="drawer-content">
        <div class="brand-block" :class="{ compact: miniState }">
          <img src="~assets/galena.png" alt="Galena" />
          <div v-if="!miniState"><strong>Administration</strong><span>Galena Institute</span></div>
        </div>

        <div v-if="!miniState" class="workspace-label">Main workspace</div>
        <q-list class="admin-nav">
          <DashboardLink v-for="routeItem in dashboardRoutesList" :key="routeItem.title" v-bind="routeItem" @dashboardLinkClicked="dashboardLinkClicked" />
        </q-list>

        <div class="drawer-spacer"></div>
        <div v-if="!miniState" class="institute-card">
          <span class="institute-icon"><q-icon name="school" /></span>
          <div><small>Galena workspace</small><strong>Manage with clarity.</strong><p>Students, classes and resources in one place.</p></div>
        </div>
        <div v-if="!miniState" class="drawer-meta"><span><i></i> System online</span><small>Administrator portal</small></div>
        <q-btn flat round dense :icon="miniState ? 'chevron_right' : 'chevron_left'" class="collapse-btn gt-sm" @click="miniState = !miniState" />
      </div>
    </q-drawer>

    <q-page-container class="admin-container"><router-view /></q-page-container>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import DashboardLink from 'components/admin/DashboardLink.vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { getFirstLetterOfString } from 'src/utils/common-utlits'

defineOptions({ name: 'AdminLayout' })
const route = useRoute()
const authStore = useAuthStore()
const dashboardRoutesList = ref([])
const headerTitle = ref('Dashboard')
const miniState = ref(false)
const drawer = ref(true)

const updateHeaderTitleFromRoute = () => {
  const matched = dashboardRoutesList.value.find((item) => item.route === route.path)
  headerTitle.value = matched?.title || dashboardRoutesList.value[0]?.title || 'Dashboard'
}

const dashboardLinkClicked = (dashboardRoute) => {
  headerTitle.value = dashboardRoute.title
}

const getAdminData = async () => {
  try {
    const response = await authStore.getAuthUserDataUsingAccessToken()
    if (response.status === 200) {
      authStore.authUser = response.data.data
      dashboardRoutesList.value = await authStore.adminDashboardRouteBuild()
      updateHeaderTitleFromRoute()
    }
  } catch (error) {
    console.error(error)
  }
}

watch(() => route.path, () => { if (dashboardRoutesList.value.length) updateHeaderTitleFromRoute() })
onBeforeMount(getAdminData)
</script>

<style scoped>
.admin-layout{background:#f3f7fc;font-family:"Poppins",sans-serif}.admin-header{color:#172c55;background:rgba(255,255,255,.96);border-bottom:1px solid #e5ecf6;box-shadow:none;backdrop-filter:blur(15px)}.admin-toolbar{min-height:76px;padding:0 30px}.mobile-menu{display:none;color:#607493}.header-copy{display:grid}.header-copy span{color:#8594ab;text-transform:uppercase;letter-spacing:.09em;font-size:.6rem;font-weight:800}.header-copy strong{margin-top:3px;font-size:1.15rem}.header-action{color:#687b99}.admin-user{margin-left:12px;padding:6px 10px 6px 7px;display:flex;align-items:center;gap:10px;border:1px solid #e3eaf5;border-radius:14px;background:#fafcff;cursor:pointer}.admin-user>.q-avatar,.popup-avatar{color:white;background:linear-gradient(135deg,#2f6fec,#7443eb);font-weight:800}.admin-user>div{display:grid;line-height:1.15}.admin-user strong{max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.77rem}.admin-user span{margin-top:4px;color:#8b99af;font-size:.62rem}
.admin-drawer{color:#263c63;background:#fff;border-right:1px solid #e4ebf5!important;box-shadow:8px 0 30px rgba(28,55,108,.035)}.drawer-content{height:100%;padding:18px 14px;display:flex;flex-direction:column}.brand-block{min-height:82px;padding:13px 12px;margin-bottom:23px;display:flex;align-items:center;gap:12px;border:1px solid #e8eef7;border-radius:17px;background:linear-gradient(145deg,#fbfdff,#f3f7ff)}.brand-block.compact{padding:10px 4px;justify-content:center;border:0;background:transparent}.brand-block img{width:85px}.brand-block.compact img{width:58px}.brand-block>div{min-width:0;display:grid;padding-left:12px;border-left:1px solid #dce5f3}.brand-block strong{color:#163061;font-size:.78rem}.brand-block span{margin-top:4px;color:#8695ad;font-size:.61rem}.workspace-label{padding:0 15px 9px;color:#98a5b8;text-transform:uppercase;letter-spacing:.12em;font-size:.58rem;font-weight:850}.admin-nav{display:grid;gap:5px}.admin-nav :deep(.q-item){min-height:53px;margin:0 2px;padding:7px 12px;border-radius:13px;color:#5e708d;transition:.2s}.admin-nav :deep(.q-item:hover){color:#2f6fec;background:#f3f7ff}.admin-nav :deep(.q-item__section--avatar){min-width:42px}.admin-nav :deep(.q-icon){width:34px;height:34px;display:grid;place-items:center;border-radius:10px;color:#7083a4;background:#f2f5fa;font-size:19px;transition:.2s}.admin-nav :deep(.dashboard-link-active){color:#fff!important;background:linear-gradient(105deg,#2f6fec,#7443eb)!important;box-shadow:0 10px 23px rgba(73,76,211,.23)}.admin-nav :deep(.dashboard-link-active .q-icon){color:#fff;background:rgba(255,255,255,.16)}.drawer-spacer{flex:1}.institute-card{margin:18px 3px 12px;padding:17px;display:flex;gap:11px;color:white;border-radius:17px;background:radial-gradient(circle at 90% 15%,rgba(67,203,232,.24),transparent 28%),linear-gradient(135deg,#102f68,#244f9f);box-shadow:0 12px 25px rgba(24,58,121,.16)}.institute-icon{width:38px;height:38px;display:grid;place-items:center;flex:none;border-radius:11px;color:#80e7f8;background:rgba(255,255,255,.11);font-size:20px}.institute-card>div{display:grid}.institute-card small{color:#8fcae8;font-size:.56rem;text-transform:uppercase;letter-spacing:.07em}.institute-card strong{margin-top:4px;font-size:.75rem}.institute-card p{margin:4px 0 0;color:#adc1de;font-size:.57rem;line-height:1.45}.drawer-meta{padding:4px 9px;display:flex;align-items:center;justify-content:space-between;color:#929fb3;font-size:.55rem}.drawer-meta span{display:flex;align-items:center;gap:5px}.drawer-meta i{width:6px;height:6px;border-radius:50%;background:#1ea979;box-shadow:0 0 0 3px rgba(30,169,121,.11)}.collapse-btn{position:absolute;right:-15px;bottom:28px;color:#315ea9;background:white!important;border:1px solid #dfe7f3;box-shadow:0 6px 16px rgba(13,37,83,.14)}.admin-container{background:radial-gradient(circle at 100% 0,rgba(115,67,235,.055),transparent 30%),#f3f7fc}
@media(max-width:849px){.admin-toolbar{min-height:68px;padding:0 15px}.mobile-menu{display:inline-flex}.header-copy span{display:none}.admin-user{min-width:0;border:0;background:transparent}.admin-container{padding-top:0!important}.admin-drawer{box-shadow:15px 0 45px rgba(22,48,98,.15)}}
</style>
