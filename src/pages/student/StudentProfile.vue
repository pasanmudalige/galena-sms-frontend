<template>
  <q-page class="p-6">
    <div class="text-2xl font-semibold mb-6">My Profile</div>

    <q-card v-if="studentData">
      <q-card-section>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-grey-7 mb-1">Student Name</div>
            <div class="text-lg font-semibold">{{ studentData.student_name }}</div>
          </div>
          <div>
            <div class="text-sm text-grey-7 mb-1">Student ID</div>
            <div class="text-lg font-mono">{{ studentData.student_id }}</div>
          </div>
          <div>
            <div class="text-sm text-grey-7 mb-1">Email</div>
            <div class="text-lg">{{ studentData.email || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-grey-7 mb-1">Phone</div>
            <div class="text-lg">{{ studentData.phone || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-grey-7 mb-1">School</div>
            <div class="text-lg">{{ studentData.school || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-grey-7 mb-1">Year of A/L</div>
            <div class="text-lg">{{ studentData.year_of_al || '-' }}</div>
          </div>
          <div class="md:col-span-2">
            <div class="text-sm text-grey-7 mb-1">Address</div>
            <div class="text-lg">{{ studentData.address || '-' }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth-store'

defineOptions({
  name: 'StudentProfile',
})

const authStore = useAuthStore()
const authUser = ref(null)
const studentData = ref(null)

const loadUserData = async () => {
  try {
    const res = await authStore.getAuthUserDataUsingAccessToken()
    if (res.status === 200 && res.data?.data) {
      authUser.value = res.data.data
      await loadStudentData()
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

const loadStudentData = async () => {
  try {
    const res = await api.get('/admin/students')
    if (res.status === 200 && res.data?.data) {
      const student = res.data.data.find((s) => s.email === authUser.value?.email)
      if (student) {
        studentData.value = student
      }
    }
  } catch (error) {
    console.error('Error loading student data:', error)
  }
}

onMounted(() => {
  loadUserData()
})
</script>

