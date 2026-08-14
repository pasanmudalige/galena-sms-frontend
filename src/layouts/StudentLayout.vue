<template>
  <q-layout view="hHh Lpr lFf" class="student-layout">
    <q-header class="student-header">
      <q-toolbar class="student-toolbar">
        <q-btn flat round dense icon="menu" class="mobile-menu" @click="drawer = !drawer" />
        <div class="header-copy"><span>Galena student portal</span><strong>{{ currentPageTitle }}</strong></div>
        <q-space />
        <q-btn flat round icon="notifications_none" class="header-action"><q-badge floating rounded color="negative" /></q-btn>
        <div class="student-user">
          <q-avatar>{{ studentInitial }}</q-avatar>
          <div class="gt-xs"><strong>{{ authUser?.full_name || 'Student' }}</strong><span>{{ studentIdLabel }}</span></div>
          <q-icon name="expand_more" class="gt-xs" />
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 200px">
              <q-item clickable to="/student/profile"><q-item-section avatar><q-icon name="person_outline" /></q-item-section><q-item-section>My profile</q-item-section></q-item>
              <q-separator />
              <q-item clickable @click="handleLogout"><q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section><q-item-section>Log out</q-item-section></q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :mini="miniState" :width="278" :mini-width="82" :breakpoint="850" class="student-drawer">
      <div class="drawer-content">
        <div class="brand-block" :class="{ compact: miniState }" @click="navigateToDashboard">
          <img src="~assets/galena.png" alt="Galena" />
          <div v-if="!miniState"><strong>Student Portal</strong><span>Galena Institute</span></div>
        </div>

        <div v-if="!miniState" class="workspace-label">My workspace</div>
        <q-list class="student-nav">
          <q-item v-for="item in menuItems" :key="item.id" clickable v-ripple :to="item.route" exact :active="$route.path === item.route" active-class="student-link-active" :class="{ 'menu-item-dim': item.isUnderDevelopment }">
            <q-item-section avatar><q-icon :name="item.icon" /></q-item-section>
            <q-item-section><q-item-label>{{ item.title }}</q-item-label><q-item-label v-if="item.isUnderDevelopment" caption>Coming soon</q-item-label></q-item-section>
            <q-item-section v-if="!miniState" side><q-icon name="chevron_right" class="row-arrow" /></q-item-section>
          </q-item>
        </q-list>

        <div class="drawer-spacer"></div>
        <div v-if="!miniState" class="support-card">
          <span class="support-icon"><q-icon name="support_agent" /></span>
          <div><small>Student support</small><strong>Need some help?</strong><p>Chat with the Galena support team.</p><q-btn flat no-caps label="WhatsApp us" icon-right="arrow_forward" href="https://wa.me/94715368553" target="_blank" /></div>
        </div>
        <div v-if="!miniState" class="drawer-meta"><span><i></i> Portal online</span><small>Learn with purpose</small></div>
        <q-btn flat round dense :icon="miniState ? 'chevron_right' : 'chevron_left'" class="collapse-btn gt-sm" @click="miniState = !miniState" />
      </div>
    </q-drawer>

    <q-page-container class="portal-container"><router-view /></q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { showSuccessNotification } from 'src/utils/notification'

defineOptions({ name: 'StudentLayout' })
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(true)
const miniState = ref(false)
const authUser = ref(null)

const menuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: 'space_dashboard', route: '/student/dashboard', isUnderDevelopment: false },
  { id: 'classes', title: 'My Classes', icon: 'school', route: '/student/classes', isUnderDevelopment: false },
  { id: 'documents', title: 'My Documents', icon: 'folder_open', route: '/student/documents', isUnderDevelopment: false },
  { id: 'attendance', title: 'My Attendance', icon: 'event_available', route: '/student/attendance', isUnderDevelopment: true },
  { id: 'payments', title: 'My Payments', icon: 'account_balance_wallet', route: '/student/payments', isUnderDevelopment: true },
  { id: 'profile', title: 'My Profile', icon: 'person_outline', route: '/student/profile', isUnderDevelopment: false },
]

const currentPageTitle = computed(() => menuItems.find((item) => item.route === route.path)?.title || 'Student Portal')
const studentInitial = computed(() => (authUser.value?.full_name || 'S').trim().charAt(0).toUpperCase())
const studentIdLabel = computed(() => authUser.value?.student_id ? `ID: ${authUser.value.student_id}` : 'Student account')
const navigateToDashboard = () => router.push('/student/dashboard')
const handleLogout = async () => { await authStore.logoutApi(); showSuccessNotification('Logged out successfully') }

const loadUserData = async () => {
  try {
    const res = await authStore.getAuthUserDataUsingAccessToken()
    if (res.status === 200 && res.data?.data) authUser.value = res.data.data
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

onMounted(loadUserData)
</script>

<style scoped>
.student-layout{background:#f3f7fc;font-family:"Poppins",sans-serif}.student-header{color:#172c55;background:rgba(255,255,255,.96);border-bottom:1px solid #e5ecf6;box-shadow:none;backdrop-filter:blur(15px)}.student-toolbar{min-height:76px;padding:0 30px}.mobile-menu{display:none;color:#607493}.header-copy{display:grid}.header-copy span{color:#8594ab;text-transform:uppercase;letter-spacing:.09em;font-size:.6rem;font-weight:800}.header-copy strong{margin-top:3px;font-size:1.15rem}.header-action{color:#687b99}.student-user{margin-left:12px;padding:6px 10px 6px 7px;display:flex;align-items:center;gap:10px;border:1px solid #e3eaf5;border-radius:14px;background:#fafcff;cursor:pointer}.student-user>.q-avatar{color:white;background:linear-gradient(135deg,#2f6fec,#7443eb);font-weight:800}.student-user>div{display:grid;line-height:1.15}.student-user strong{max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.77rem}.student-user span{margin-top:4px;color:#8b99af;font-size:.62rem}
.student-drawer{color:#263c63;background:#fff;border-right:1px solid #e4ebf5!important;box-shadow:8px 0 30px rgba(28,55,108,.035)}.drawer-content{height:100%;padding:18px 14px;display:flex;flex-direction:column}.brand-block{min-height:82px;padding:13px 12px;margin-bottom:23px;display:flex;align-items:center;gap:12px;border:1px solid #e8eef7;border-radius:17px;background:linear-gradient(145deg,#fbfdff,#f3f7ff);cursor:pointer}.brand-block.compact{padding:10px 4px;justify-content:center;border:0;background:transparent}.brand-block img{width:85px}.brand-block.compact img{width:58px}.brand-block>div{min-width:0;display:grid;padding-left:12px;border-left:1px solid #dce5f3}.brand-block strong{color:#163061;font-size:.78rem}.brand-block span{margin-top:4px;color:#8695ad;font-size:.61rem}.workspace-label{padding:0 15px 9px;color:#98a5b8;text-transform:uppercase;letter-spacing:.12em;font-size:.58rem;font-weight:850}.student-nav{display:grid;gap:5px}.student-nav :deep(.q-item){min-height:53px;margin:0 2px;padding:7px 12px;border-radius:13px;color:#5e708d;transition:.2s}.student-nav :deep(.q-item:hover){color:#2f6fec;background:#f3f7ff}.student-nav :deep(.q-item__section--avatar){min-width:42px}.student-nav :deep(.q-item__section--side){padding-left:5px}.student-nav :deep(.q-icon){width:34px;height:34px;display:grid;place-items:center;border-radius:10px;color:#7083a4;background:#f2f5fa;font-size:19px;transition:.2s}.student-nav :deep(.row-arrow){width:auto;height:auto;background:transparent;font-size:17px}.student-nav :deep(.student-link-active){color:#fff!important;background:linear-gradient(105deg,#2f6fec,#7443eb)!important;box-shadow:0 10px 23px rgba(73,76,211,.23)}.student-nav :deep(.student-link-active .q-icon){color:#fff;background:rgba(255,255,255,.16)}.student-nav :deep(.student-link-active .row-arrow){background:transparent}.student-nav :deep(.q-item__label--caption){color:#98a6ba;font-size:.57rem}.student-nav :deep(.student-link-active .q-item__label--caption){color:#dbe4ff}.menu-item-dim{opacity:.6}.menu-item-dim:hover{opacity:.9}.drawer-spacer{flex:1}.support-card{margin:18px 3px 12px;padding:17px;display:flex;gap:11px;color:white;border-radius:17px;background:radial-gradient(circle at 90% 15%,rgba(67,203,232,.24),transparent 28%),linear-gradient(135deg,#102f68,#244f9f);box-shadow:0 12px 25px rgba(24,58,121,.16)}.support-icon{width:38px;height:38px;display:grid;place-items:center;flex:none;border-radius:11px;color:#80e7f8;background:rgba(255,255,255,.11);font-size:20px}.support-card>div{display:grid}.support-card small{color:#8fcae8;font-size:.56rem;text-transform:uppercase;letter-spacing:.07em}.support-card strong{margin-top:4px;font-size:.75rem}.support-card p{margin:4px 0 2px;color:#adc1de;font-size:.57rem;line-height:1.45}.support-card .q-btn{justify-self:start;min-height:auto;padding:4px 0;color:#80e7f8;font-size:.61rem;font-weight:750}.drawer-meta{padding:4px 9px;display:flex;align-items:center;justify-content:space-between;color:#929fb3;font-size:.55rem}.drawer-meta span{display:flex;align-items:center;gap:5px}.drawer-meta i{width:6px;height:6px;border-radius:50%;background:#1ea979;box-shadow:0 0 0 3px rgba(30,169,121,.11)}.collapse-btn{position:absolute;right:-15px;bottom:28px;color:#315ea9;background:white!important;border:1px solid #dfe7f3;box-shadow:0 6px 16px rgba(13,37,83,.14)}.portal-container{background:radial-gradient(circle at 100% 0,rgba(115,67,235,.055),transparent 30%),#f3f7fc}
@media(max-width:849px){.student-toolbar{min-height:68px;padding:0 15px}.mobile-menu{display:inline-flex}.header-copy span{display:none}.student-user{min-width:0;border:0;background:transparent}.portal-container{padding-top:0!important}.student-drawer{box-shadow:15px 0 45px rgba(22,48,98,.15)}}
</style>
