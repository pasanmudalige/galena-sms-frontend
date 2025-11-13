<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4 text-weight-bold text-grey-8">My Classes</div>
          <div class="text-subtitle2 text-grey-6">View all your enrolled classes</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="refresh"
            label="Refresh"
            flat
            @click="loadClasses"
            :loading="loading"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row q-col-gutter-md q-mb-md" v-if="classRows.length > 0">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Total Classes</div>
                  <div class="text-h4 text-weight-bold text-primary q-mt-xs">
                    {{ classRows.length }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="blue-1" text-color="primary">
                    <q-icon name="school" size="32px" />
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
                  <div class="text-overline text-grey-7">Active Classes</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">
                    {{ activeClassesCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="green-1" text-color="positive">
                    <q-icon name="check_circle" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Classes Table -->
      <q-card flat bordered v-if="classRows.length > 0">
        <q-card-section class="q-pa-md">
          <q-table
            :rows="classRows"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            :rows-per-page-options="[5, 10, 20, 50]"
            class="classes-table"
          >
            <template #top>
              <div class="text-h6 text-weight-bold text-grey-8">Enrolled Classes</div>
            </template>

            <template #body-cell-class_name="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-avatar size="40px" color="primary" text-color="white" class="q-mr-sm">
                    <q-icon name="class" />
                  </q-avatar>
                  <div>
                    <div class="text-weight-medium text-grey-9">{{ props.value }}</div>
                    <div class="text-caption text-grey-6">{{ props.row.subject }}</div>
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-subject="props">
              <q-td :props="props">
                <q-chip size="sm" color="info" text-color="white" icon="subject">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-enrolled_date="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-icon name="event" size="16px" color="grey-6" class="q-mr-xs" />
                  <span class="text-body2">{{ props.value }}</span>
                </div>
              </q-td>
            </template>

            <template #body-cell-qr_code="props">
              <q-td :props="props" class="text-center">
                <q-btn
                  v-if="props.row.enrollment_id"
                  unelevated
                  color="primary"
                  icon="qr_code_scanner"
                  label="View QR Code"
                  size="sm"
                  @click="showQRCode(props.row.enrollment_id)"
                />
                <span v-else class="text-grey-6 text-caption">N/A</span>
              </q-td>
            </template>

            <template #no-data>
              <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-lg">
                <q-icon name="class" size="2em" />
                <span>No classes enrolled yet</span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Empty State -->
      <q-card v-else flat bordered>
        <q-card-section class="q-pa-xl text-center">
          <q-icon name="school" size="64px" color="grey-4" class="q-mb-md" />
          <div class="text-h6 text-grey-7 q-mb-sm">No Classes Enrolled</div>
          <div class="text-body2 text-grey-6">You haven't enrolled in any classes yet.</div>
        </q-card-section>
      </q-card>

      <!-- QR Code Dialog -->
      <q-dialog v-model="showQRDialog">
        <q-card class="rounded-xl shadow-lg" style="min-width: 400px; max-width: 500px">
          <q-card-section class="bg-primary text-white text-center q-pa-lg">
            <div class="text-h6 text-weight-bold">Class QR Code</div>
            <div class="text-caption q-mt-xs opacity-90">Scan this code for attendance</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg text-center">
            <div v-if="qrCodeUrl" class="q-mb-md">
              <q-img
                :src="qrCodeUrl"
                style="max-width: 300px; margin: 0 auto"
                class="rounded-borders"
              />
            </div>
            <div v-else class="q-pa-lg">
              <q-spinner color="primary" size="3em" />
              <div class="text-caption text-grey-6 q-mt-md">Loading QR Code...</div>
            </div>
            <div v-if="qrCodeString" class="q-mt-md">
              <div class="text-caption text-grey-7 q-mb-xs">QR Code String:</div>
              <div class="text-body2 font-mono bg-grey-2 q-pa-sm rounded-borders">
                {{ qrCodeString }}
              </div>
            </div>
            <div v-if="enrollmentDetails" class="q-mt-md text-left">
              <q-separator class="q-mb-md" />
              <div class="text-subtitle2 q-mb-xs">
                <q-icon name="school" size="16px" class="q-mr-xs" />
                <strong>Class:</strong> {{ enrollmentDetails.class?.class_name }}
              </div>
              <div class="text-subtitle2">
                <q-icon name="event" size="16px" class="q-mr-xs" />
                <strong>Enrollment Date:</strong>
                {{ formatDate(enrollmentDetails.enrollment_date) }}
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              color="secondary"
              no-caps
              label="Download QR"
              icon="download"
              unelevated
              @click="downloadQR"
              :disable="!qrCodeUrl"
            />
            <q-btn flat no-caps label="Close" color="grey-7" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth-store'
import { showSuccessNotification } from 'src/utils/notification'

defineOptions({
  name: 'StudentClasses',
})

const authStore = useAuthStore()
const authUser = ref(null)
const classRows = ref([])
const showQRDialog = ref(false)
const qrCodeUrl = ref('')
const qrCodeString = ref('')
const enrollmentDetails = ref(null)
const loading = ref(false)

const activeClassesCount = computed(() => {
  return classRows.value.filter((c) => c.enrollment_id).length
})

const columns = [
  {
    name: 'class_name',
    label: 'Class Name',
    field: 'class_name',
    align: 'left',
    sortable: true,
    style: 'min-width: 200px',
  },
  {
    name: 'subject',
    label: 'Subject',
    field: 'subject',
    align: 'left',
    sortable: true,
  },
  {
    name: 'enrolled_date',
    label: 'Enrolled Date',
    field: 'enrolled_date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'qr_code',
    label: 'QR Code',
    field: 'qr_code',
    align: 'center',
    style: 'width: 150px',
  },
]

const loadUserData = async () => {
  try {
    const res = await authStore.getAuthUserDataUsingAccessToken()
    if (res.status === 200 && res.data?.data) {
      authUser.value = res.data.data
      await loadClasses()
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

const loadClasses = async () => {
  loading.value = true
  try {
    const studentsRes = await api.get('/admin/students')
    if (studentsRes.status === 200 && studentsRes.data?.data) {
      const student = studentsRes.data.data.find((s) => s.email === authUser.value?.email)
      if (student) {
        const enrollmentsRes = await api.get('/admin/enrollments')
        if (enrollmentsRes.status === 200 && enrollmentsRes.data?.data) {
          const studentEnrollments = enrollmentsRes.data.data.filter(
            (e) => e.student?.id === student.id,
          )

          classRows.value = studentEnrollments.map((e) => ({
            id: e.id,
            class_name: e.class?.class_name || 'N/A',
            subject: e.class?.subject || e.class?.class_code || 'N/A',
            enrolled_date: e.enrollment_date
              ? new Date(e.enrollment_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A',
            qr_code: e.enrollment_qr_code,
            enrollment_id: e.id,
          }))
        }
      }
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    console.log(e)
    return dateString
  }
}

const showQRCode = async (enrollmentId) => {
  showQRDialog.value = true
  qrCodeUrl.value = ''
  qrCodeString.value = ''
  enrollmentDetails.value = null
  try {
    const res = await api.get(`/admin/enrollments/${enrollmentId}`)
    if (res.status === 200 && res.data?.data) {
      qrCodeUrl.value = res.data.data.qr_code_image
      qrCodeString.value = res.data.data.enrollment?.enrollment_qr_code || ''
      enrollmentDetails.value = res.data.data.enrollment
    }
  } catch (error) {
    console.error('Error loading QR code:', error)
  }
}

const downloadQR = () => {
  if (qrCodeUrl.value) {
    const link = document.createElement('a')
    link.href = qrCodeUrl.value
    link.download = `enrollment-qr-${qrCodeString.value || 'code'}.png`
    link.click()
    showSuccessNotification('QR code downloaded successfully')
  }
}

onMounted(() => {
  loadUserData()
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

.classes-table :deep(.q-table__top) {
  padding: 16px;
}

.classes-table :deep(.q-table thead tr th) {
  background-color: #f5f5f5;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.classes-table :deep(.q-table tbody tr:hover) {
  background-color: #f9f9f9;
}
</style>
