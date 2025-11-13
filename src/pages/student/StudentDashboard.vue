<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4 text-weight-bold text-grey-8">Student Dashboard</div>
          <div class="text-subtitle2 text-grey-6">
            Welcome back, {{ authUser?.full_name || 'Student' }}! Here's your overview.
          </div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="refresh"
            label="Refresh"
            flat
            @click="loadDashboard"
            :loading="loading"
          />
        </div>
      </div>

      <!-- Top Stats Cards -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Attendance Rate</div>
                  <div class="text-h4 text-weight-bold text-primary q-mt-xs">
                    {{ stats.attendanceRate || 0 }}%
                  </div>
                  <div class="text-caption text-positive q-mt-xs" v-if="stats.totalAttendance > 0">
                    <q-icon name="check_circle" size="14px" />
                    {{ stats.presentCount }} of {{ stats.totalAttendance }} classes
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs" v-else>
                    No attendance records yet
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="blue-1" text-color="primary">
                    <q-icon name="event_available" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-green">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Total Classes</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">
                    {{ stats.totalClasses || 0 }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    <q-icon name="class" size="14px" />
                    Enrolled classes
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="green-1" text-color="positive">
                    <q-icon name="school" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-orange">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Pending Payments</div>
                  <div class="text-h4 text-weight-bold text-warning q-mt-xs">
                    {{ stats.pendingPayments || 0 }}
                  </div>
                  <div class="text-caption text-warning q-mt-xs">
                    <q-icon name="warning" size="14px" />
                    Require attention
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="orange-1" text-color="warning">
                    <q-icon name="payments" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-purple">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">My Documents</div>
                  <div class="text-h4 text-weight-bold text-purple q-mt-xs">
                    {{ stats.documentsCount || 0 }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    <q-icon name="description" size="14px" />
                    Uploaded documents
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="purple-1" text-color="purple">
                    <q-icon name="folder" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Student Info Card -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Student Information</div>
                  <div class="text-h6 text-weight-bold text-grey-8 q-mt-xs">
                    {{ studentData?.student_id || 'N/A' }}
                  </div>
                  <div class="q-mt-sm">
                    <q-chip size="sm" color="primary" text-color="white" icon="person">
                      {{ authUser?.full_name || 'Student' }}
                    </q-chip>
                    <q-chip
                      v-if="studentData?.email"
                      size="sm"
                      color="info"
                      text-color="white"
                      icon="email"
                    >
                      {{ studentData.email }}
                    </q-chip>
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="72px" color="primary" text-color="white">
                    <q-icon name="person" size="40px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Recent Attendance</div>
                  <div class="text-h3 text-weight-bold text-grey-8 q-mt-xs">
                    {{ recentAttendance.length }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">Last 7 days records</div>
                </div>
                <div class="col-auto">
                  <q-avatar size="72px" color="indigo-1" text-color="indigo">
                    <q-icon name="history" size="40px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-md">
                <div class="col">
                  <div class="text-h6 text-weight-bold text-grey-8">
                    <q-icon name="history" color="primary" size="24px" class="q-mr-xs" />
                    Recent Attendance
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn
                    flat
                    dense
                    color="primary"
                    label="View All"
                    size="sm"
                    @click="$router.push('/student/attendance')"
                  />
                </div>
              </div>

              <q-list separator v-if="recentAttendance.length > 0">
                <q-item
                  v-for="(item, index) in recentAttendance.slice(0, 5)"
                  :key="index"
                  class="q-px-none"
                >
                  <q-item-section avatar>
                    <q-avatar
                      :color="item.attendance_status === 'present' ? 'positive' : 'negative'"
                      text-color="white"
                      size="40px"
                    >
                      <q-icon :name="item.attendance_status === 'present' ? 'check' : 'close'" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ item.class_name || 'Class' }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-6">
                      <q-icon name="event" size="14px" />
                      {{ formatDate(item.date) }} · {{ item.attendance_status }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-center text-grey-6 q-py-md">No recent attendance records</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-md">
                <div class="col">
                  <div class="text-h6 text-weight-bold text-grey-8">
                    <q-icon name="class" color="positive" size="24px" class="q-mr-xs" />
                    My Classes
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn
                    flat
                    dense
                    color="primary"
                    label="View All"
                    size="sm"
                    @click="$router.push('/student/classes')"
                  />
                </div>
              </div>

              <q-list separator v-if="classList.length > 0">
                <q-item
                  v-for="(item, index) in classList.slice(0, 5)"
                  :key="index"
                  class="q-px-none"
                >
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="40px">
                      <q-icon name="class" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ item.class_name || 'Class' }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-6">
                      <q-icon name="subject" size="14px" />
                      {{ item.subject || 'N/A' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-center text-grey-6 q-py-md">No classes enrolled</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <q-card flat bordered>
        <q-card-section class="q-pa-md">
          <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">Quick Actions</div>
          <div class="row q-col-gutter-sm">
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="primary"
                icon="class"
                label="My Classes"
                class="full-width action-btn"
                @click="$router.push('/student/classes')"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="positive"
                icon="event_available"
                label="Attendance"
                class="full-width action-btn"
                @click="$router.push('/student/attendance')"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="orange"
                icon="payments"
                label="Payments"
                class="full-width action-btn"
                @click="$router.push('/student/payments')"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="purple"
                icon="folder"
                label="Documents"
                class="full-width action-btn"
                @click="$router.push('/student/documents')"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="indigo"
                icon="person"
                label="Profile"
                class="full-width action-btn"
                @click="$router.push('/student/profile')"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
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
const loading = ref(false)
const stats = ref({
  attendanceRate: 0,
  totalClasses: 0,
  pendingPayments: 0,
  documentsCount: 0,
  presentCount: 0,
  totalAttendance: 0,
})
const recentAttendance = ref([])
const classList = ref([])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch (e) {
    console.log(e)
    return dateString
  }
}

const loadDashboard = async () => {
  loading.value = true
  try {
    await loadUserData()
  } catch (error) {
    console.error('Error loading dashboard:', error)
  } finally {
    loading.value = false
  }
}

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
        await Promise.all([
          loadStats(student.id),
          loadAttendance(student.id),
          loadClasses(student.id),
          loadDocuments(),
        ])
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
      const studentEnrollments = enrollmentsRes.data.data.filter((e) => e.student?.id === studentId)
      stats.value.totalClasses = studentEnrollments.length

      // Load attendance data
      const attendanceRes = await api.get('/admin/attendance')
      if (attendanceRes.status === 200 && attendanceRes.data?.data) {
        const studentAttendance = attendanceRes.data.data.filter(
          (a) => a.enrollment?.student?.id === studentId,
        )
        const presentCount = studentAttendance.filter(
          (a) => a.attendance_status === 'present',
        ).length
        const totalCount = studentAttendance.length
        stats.value.totalAttendance = totalCount
        stats.value.presentCount = presentCount
        if (totalCount > 0) {
          stats.value.attendanceRate = Math.round((presentCount / totalCount) * 100)
        }
      }
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadAttendance = async (studentId) => {
  try {
    const attendanceRes = await api.get('/admin/attendance')
    if (attendanceRes.status === 200 && attendanceRes.data?.data) {
      const studentAttendance = attendanceRes.data.data
        .filter((a) => a.enrollment?.student?.id === studentId)
        .map((a) => ({
          id: a.id,
          date: a.date,
          attendance_status: a.attendance_status,
          class_name: a.enrollment?.class?.class_name || 'N/A',
          marked_at: a.marked_at,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 7)

      recentAttendance.value = studentAttendance
    }
  } catch (error) {
    console.error('Error loading attendance:', error)
  }
}

const loadClasses = async (studentId) => {
  try {
    const enrollmentsRes = await api.get('/admin/enrollments')
    if (enrollmentsRes.status === 200 && enrollmentsRes.data?.data) {
      const studentEnrollments = enrollmentsRes.data.data
        .filter((e) => e.student?.id === studentId)
        .map((e) => ({
          id: e.id,
          class_name: e.class?.class_name || 'N/A',
          subject: e.class?.subject || 'N/A',
          enrollment_id: e.id,
        }))

      classList.value = studentEnrollments
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const loadDocuments = async () => {
  try {
    const res = await api.get('/common/student/documents')
    if (res.status === 200 && res.data?.data) {
      stats.value.documentsCount = res.data.data.length || 0
    }
  } catch (error) {
    console.error('Error loading documents:', error)
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
.stat-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card-blue {
  border-left-color: #1976d2;
}

.stat-card-green {
  border-left-color: #21ba45;
}

.stat-card-orange {
  border-left-color: #f2c037;
}

.stat-card-purple {
  border-left-color: #9c27b0;
}

.action-btn {
  height: 80px;
  flex-direction: column;
  font-size: 12px;
}

.action-btn :deep(.q-btn__content) {
  flex-direction: column;
  gap: 8px;
}

.action-btn :deep(.q-icon) {
  font-size: 28px;
}
</style>
