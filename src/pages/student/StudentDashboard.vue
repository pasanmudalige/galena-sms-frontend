<template>
  <q-page class="p-6">
    <div class="text-2xl font-semibold mb-6">Student Dashboard</div>

    <!-- Welcome Card -->
    <q-card class="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white">
      <q-card-section>
        <div class="text-xl font-semibold">
          Welcome, {{ authUser?.full_name || 'Student' }}!
        </div>
        <div class="text-sm opacity-90 mt-1">
          Student ID: {{ studentData?.student_id || 'N/A' }}
        </div>
      </q-card-section>
    </q-card>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <q-card>
        <q-card-section>
          <div class="text-grey-7 text-sm">Total Classes</div>
          <div class="text-2xl font-semibold">{{ stats.totalClasses || 0 }}</div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-grey-7 text-sm">Attendance Rate</div>
          <div class="text-2xl font-semibold">{{ stats.attendanceRate || 0 }}%</div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-grey-7 text-sm">Pending Payments</div>
          <div class="text-2xl font-semibold">{{ stats.pendingPayments || 0 }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Recent Activity -->
    <q-card>
      <q-card-section>
        <div class="text-lg font-semibold mb-4">Recent Activity</div>
        <div v-if="recentActivity.length === 0" class="text-grey-6 text-center py-8">
          No recent activity
        </div>
        <q-list v-else>
          <q-item v-for="(item, index) in recentActivity" :key="index">
            <q-item-section avatar>
              <q-icon :name="item.icon" :color="item.color" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption>{{ item.date }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth-store'

defineOptions({
  name: 'StudentDashboard',
})

const authStore = useAuthStore()
const authUser = ref(null)
const studentData = ref(null)
const stats = ref({
  totalClasses: 0,
  attendanceRate: 0,
  pendingPayments: 0,
})
const recentActivity = ref([])

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
    // Get student data by email
    const res = await api.get('/admin/students')
    if (res.status === 200 && res.data?.data) {
      const student = res.data.data.find((s) => s.email === authUser.value?.email)
      if (student) {
        studentData.value = student
        await loadStats(student.id)
      }
    }
  } catch (error) {
    console.error('Error loading student data:', error)
  }
}

const loadStats = async (studentId) => {
  try {
    // Load enrollment count
    const enrollmentsRes = await api.get('/admin/enrollments')
    if (enrollmentsRes.status === 200 && enrollmentsRes.data?.data) {
      const studentEnrollments = enrollmentsRes.data.data.filter(
        (e) => e.student?.id === studentId
      )
      stats.value.totalClasses = studentEnrollments.length

      // Load attendance data
      const attendanceRes = await api.get('/admin/attendance')
      if (attendanceRes.status === 200 && attendanceRes.data?.data) {
        const studentAttendance = attendanceRes.data.data.filter(
          (a) => a.enrollment?.student?.id === studentId
        )
        const presentCount = studentAttendance.filter((a) => a.attendance_status === 'present').length
        const totalCount = studentAttendance.length
        if (totalCount > 0) {
          stats.value.attendanceRate = Math.round((presentCount / totalCount) * 100)
        }
      }
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

onMounted(() => {
  loadUserData()
})
</script>

