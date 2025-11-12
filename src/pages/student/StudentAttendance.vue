<template>
  <q-page class="p-6">
    <div class="text-2xl font-semibold mb-6">My Attendance</div>

    <q-table :rows="attendanceRows" :columns="columns" row-key="id" flat bordered>
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.value === 'present' ? 'positive' : 'negative'"
            :label="props.value"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth-store'

defineOptions({
  name: 'StudentAttendance',
})

const authStore = useAuthStore()
const authUser = ref(null)
const attendanceRows = ref([])

const columns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'class_name', label: 'Class', field: 'class_name', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'marked_at', label: 'Marked At', field: 'marked_at', align: 'left' },
]

const loadUserData = async () => {
  try {
    const res = await authStore.getAuthUserDataUsingAccessToken()
    if (res.status === 200 && res.data?.data) {
      authUser.value = res.data.data
      await loadAttendance()
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

const loadAttendance = async () => {
  try {
    // Get student data
    const studentsRes = await api.get('/admin/students')
    if (studentsRes.status === 200 && studentsRes.data?.data) {
      const student = studentsRes.data.data.find((s) => s.email === authUser.value?.email)
      if (student) {
        // Get enrollments
        const enrollmentsRes = await api.get('/admin/enrollments')
        if (enrollmentsRes.status === 200 && enrollmentsRes.data?.data) {
          const studentEnrollments = enrollmentsRes.data.data.filter(
            (e) => e.student?.id === student.id
          )
          const enrollmentIds = studentEnrollments.map((e) => e.id)

          // Get attendance
          const attendanceRes = await api.get('/admin/attendance')
          if (attendanceRes.status === 200 && attendanceRes.data?.data) {
            const studentAttendance = attendanceRes.data.data.filter((a) =>
              enrollmentIds.includes(a.enrollment_id)
            )

            attendanceRows.value = studentAttendance.map((a) => ({
              id: a.id,
              date: new Date(a.attendance_datetime).toLocaleDateString(),
              class_name: a.enrollment?.class?.class_name || 'N/A',
              status: a.attendance_status,
              marked_at: new Date(a.createdAt).toLocaleString(),
            }))
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading attendance:', error)
  }
}

onMounted(() => {
  loadUserData()
})
</script>

