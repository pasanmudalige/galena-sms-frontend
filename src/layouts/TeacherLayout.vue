<template>
  <q-layout view="hHh Lpr lFf" class="teacher-layout">
    <q-header class="teacher-header"><q-toolbar class="toolbar"><q-btn flat round dense icon="menu" class="lt-md" @click="drawer=!drawer"/><div><small>GALENA TEACHER PORTAL</small><strong>{{ route.meta.title || 'Dashboard' }}</strong></div><q-space/><div class="teacher-user"><q-avatar>{{ initial }}</q-avatar><span class="gt-xs"><b>{{ auth.authUser?.fullname || 'Teacher' }}</b><small>{{ auth.authUser?.email }}</small></span><q-btn flat round dense icon="logout" @click="auth.logoutApi()"/></div></q-toolbar></q-header>
    <q-drawer v-model="drawer" show-if-above :width="270" :breakpoint="900" class="teacher-drawer"><div class="drawer-body"><div class="brand"><img src="~assets/galena.png"/><div><b>Teacher Workspace</b><small>Create. Present. Inspire.</small></div></div><div class="nav-label">WORKSPACE</div><q-list><q-item clickable to="/teacher/dashboard" exact active-class="active"><q-item-section avatar><q-icon name="dashboard"/></q-item-section><q-item-section>Dashboard</q-item-section></q-item><q-item clickable to="/teacher/quizzes" active-class="active"><q-item-section avatar><q-icon name="folder_special"/></q-item-section><q-item-section>My Quiz Programmes</q-item-section></q-item></q-list><q-space/><div class="portal-note"><q-icon name="quiz"/><b>Galena Quiz Studio</b><small>Your programmes are securely saved.</small></div></div></q-drawer>
    <q-page-container><router-view/></q-page-container>
  </q-layout>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
const route=useRoute(), auth=useAuthStore(), drawer=ref(true)
const initial=computed(()=>(auth.authUser?.fullname||'T').charAt(0).toUpperCase())
onMounted(async()=>{ try { const r=await auth.getAuthUserDataUsingAccessToken(); auth.authUser=r.data.data } catch(e){ console.error(e) } })
</script>
<style scoped>
.teacher-layout{background:#f3f7fc;color:#172c55}.teacher-header{background:rgba(255,255,255,.97);color:#172c55;border-bottom:1px solid #e4ebf5;box-shadow:none}.toolbar{min-height:76px;padding:0 28px}.toolbar>div:first-of-type{display:grid}.toolbar>div>small{color:#8493ab;font-size:.61rem;font-weight:800;letter-spacing:.09em}.toolbar>div>strong{font-size:1.1rem}.teacher-user{display:flex;align-items:center;gap:10px}.teacher-user .q-avatar{color:#fff;background:linear-gradient(135deg,#1677ff,#7443eb);font-weight:800}.teacher-user>span{display:grid}.teacher-user small{color:#8391a7}.teacher-drawer{border-right:1px solid #e3eaf5!important}.drawer-body{height:100%;padding:20px 14px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:12px;padding:14px 10px 24px}.brand img{width:82px}.brand>div{display:grid;border-left:1px solid #dce5f3;padding-left:12px}.brand small{color:#8998ae;font-size:.62rem}.nav-label{padding:10px 14px;color:#9aa6b8;font-size:.6rem;font-weight:800;letter-spacing:.11em}.q-item{margin:4px;border-radius:13px;color:#61738f}.q-item .q-icon{color:#607da8}.active{color:#fff!important;background:linear-gradient(105deg,#1677ff,#6745e8)}.active .q-icon{color:#fff}.portal-note{display:grid;gap:5px;margin:15px 5px;padding:18px;color:#fff;border-radius:17px;background:linear-gradient(135deg,#092653,#245db3)}.portal-note .q-icon{font-size:28px;color:#6ce0ef}.portal-note small{color:#b9cae1;font-size:.65rem}
</style>
