<template>
  <q-page class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-semibold">Mark Attendance</div>
      <q-btn
        no-caps
        color="primary"
        icon="qr_code_scanner"
        label="QR Scanner"
        @click="showQRScanner = true"
      />
    </div>

    <q-card class="q-mb-md">
      <q-tabs v-model="tab" align="left" class="text-primary">
        <q-tab name="manual" label="Manual Entry" icon="edit" />
        <q-tab name="qr" label="QR Scanner" icon="qr_code_scanner" />
        <q-tab name="history" label="Attendance History" icon="history" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <!-- Manual Entry Tab -->
        <q-tab-panel name="manual">
          <q-form @submit.prevent="submitManual">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="manualForm.enrollment_id"
                  label="Select Enrollment"
                  dense
                  outlined
                  :options="enrollmentOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  :rules="[(v) => !!v || 'Required']"
                  use-input
                  input-debounce="0"
                  @filter="filterEnrollments"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">No enrollments found</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="manualForm.attendance_datetime"
                  label="Date & Time"
                  dense
                  outlined
                  type="datetime-local"
                  :rules="[(v) => !!v || 'Required']"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="manualForm.notes"
                  label="Notes (optional)"
                  dense
                  outlined
                  type="textarea"
                  rows="3"
                />
              </div>

              <div class="col-12">
                <q-checkbox
                  v-model="manualForm.override_allowed"
                  label="Manual Override (if payment is overdue)"
                />
              </div>

              <div v-if="manualForm.override_allowed" class="col-12">
                <q-input
                  v-model="manualForm.override_reason"
                  label="Override Reason"
                  dense
                  outlined
                  :rules="[(v) => !!v || 'Required if override is enabled']"
                />
              </div>

              <div class="col-12">
                <q-btn
                  color="primary"
                  no-caps
                  label="Mark Attendance"
                  type="submit"
                  :loading="markingAttendance"
                  icon="check_circle"
                />
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <!-- QR Scanner Tab -->
        <q-tab-panel name="qr">
          <div class="text-center">
            <div v-if="!scanning" class="q-mb-md">
              <q-btn
                color="primary"
                no-caps
                label="Start QR Scanner"
                icon="qr_code_scanner"
                @click="startScanner"
                size="lg"
              />
              <div class="text-caption text-grey-7 q-mt-md">
                Point your camera at the student's QR code
              </div>
            </div>

            <div v-if="scanning" class="scanner-container">
              <div id="qr-reader" style="width: 100%; max-width: 500px"></div>
              <q-btn
                color="negative"
                no-caps
                label="Stop Scanner"
                icon="stop"
                @click="stopScanner"
                class="q-mt-md"
              />
            </div>

            <div v-if="lastScanned" class="q-mt-md">
              <q-card class="bg-positive text-white">
                <q-card-section>
                  <q-icon name="check_circle" size="48px" />
                  <div class="text-h6 q-mt-sm">Attendance Marked Successfully!</div>
                  <div class="q-mt-sm">
                    Student: {{ lastScanned.student_name }}<br />
                    Class: {{ lastScanned.class_name }}<br />
                    Time: {{ lastScanned.attendance_datetime }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- History Tab -->
        <q-tab-panel name="history">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="historyFilters.enrollment_id"
                label="Filter by Enrollment"
                dense
                outlined
                clearable
                :options="enrollmentOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                @update:model-value="loadHistory"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="historyFilters.date_from"
                label="From Date"
                dense
                outlined
                type="date"
                @update:model-value="loadHistory"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="historyFilters.date_to"
                label="To Date"
                dense
                outlined
                type="date"
                @update:model-value="loadHistory"
              />
            </div>
          </div>

          <q-table
            :rows="attendanceHistory"
            :columns="historyColumns"
            row-key="id"
            flat
            bordered
            :loading="loadingHistory"
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="
                    props.value === 'present'
                      ? 'positive'
                      : props.value === 'blocked_unpaid'
                        ? 'negative'
                        : 'warning'
                  "
                >
                  {{ props.value }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Success Dialog -->
    <q-dialog v-model="showSuccess">
      <q-card style="min-width: 420px">
        <q-card-section class="text-center">
          <q-icon name="check_circle" color="positive" size="64px" />
          <div class="text-xl font-semibold mt-2">{{ successMessage }}</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" no-caps label="OK" @click="closeSuccess" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { api } from 'src/boot/axios'

const tab = ref('manual')
const showQRScanner = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const markingAttendance = ref(false)
const loadingHistory = ref(false)
const scanning = ref(false)
const scanner = ref(null)
// const videoElement = ref(null)
const lastScanned = ref(null)

const enrollments = ref([])
const enrollmentOptions = ref([])
const allEnrollments = ref([])
const attendanceHistory = ref([])

const manualForm = ref({
  enrollment_id: null,
  attendance_datetime: new Date().toISOString().slice(0, 16),
  notes: '',
  override_allowed: false,
  override_reason: '',
})

const historyFilters = ref({
  enrollment_id: null,
  date_from: null,
  date_to: null,
})

const historyColumns = [
  {
    name: 'student',
    label: 'Student',
    field: 'student',
    align: 'left',
    format: (val, row) => row.enrollment?.student?.student_name || '-',
  },
  {
    name: 'class',
    label: 'Class',
    field: 'class',
    align: 'left',
    format: (val, row) => row.enrollment?.class?.class_name || '-',
  },
  {
    name: 'attendance_datetime',
    label: 'Date & Time',
    field: 'attendance_datetime',
    align: 'left',
    sortable: true,
    format: (val) => (val ? new Date(val).toLocaleString() : '-'),
  },
  {
    name: 'status',
    label: 'Status',
    field: 'attendance_status',
    align: 'left',
  },
  {
    name: 'method',
    label: 'Method',
    field: 'entry_method',
    align: 'left',
  },
]

const loadEnrollments = async () => {
  const res = await api.get('/admin/enrollments')
  if (res.status === 200 && res.data?.data) {
    enrollments.value = res.data.data.filter((e) => e.status === 'active')
    allEnrollments.value = enrollments.value
    enrollmentOptions.value = enrollments.value.map((e) => ({
      label: `${e.student?.student_name} - ${e.class?.class_name}`,
      value: e.id,
    }))
  }
}

const filterEnrollments = (val, update) => {
  if (val === '') {
    update(() => {
      enrollmentOptions.value = allEnrollments.value.map((e) => ({
        label: `${e.student?.student_name} - ${e.class?.class_name}`,
        value: e.id,
      }))
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    enrollmentOptions.value = allEnrollments.value
      .filter((e) => {
        const studentName = e.student?.student_name?.toLowerCase() || ''
        const className = e.class?.class_name?.toLowerCase() || ''
        return studentName.includes(needle) || className.includes(needle)
      })
      .map((e) => ({
        label: `${e.student?.student_name} - ${e.class?.class_name}`,
        value: e.id,
      }))
  })
}

const submitManual = async () => {
  try {
    markingAttendance.value = true
    const payload = {
      ...manualForm.value,
      attendance_datetime: new Date(manualForm.value.attendance_datetime).toISOString(),
    }
    const res = await api.post('/admin/attendance/manual', payload)
    if (res.status === 201) {
      successMessage.value = 'Attendance marked successfully'
      showSuccess.value = true
      manualForm.value = {
        enrollment_id: null,
        attendance_datetime: new Date().toISOString().slice(0, 16),
        notes: '',
        override_allowed: false,
        override_reason: '',
      }
      await loadHistory()
    }
  } catch (error) {
    console.error('Attendance error:', error)
    if (error.response?.data?.message) {
      successMessage.value = error.response.data.message
      showSuccess.value = true
    }
  } finally {
    markingAttendance.value = false
  }
}

const startScanner = async () => {
  try {
    scanning.value = true
    const { Html5Qrcode } = await import('html5-qrcode')

    // Create scanner element if it doesn't exist
    let scannerElement = document.getElementById('qr-reader')
    if (!scannerElement) {
      const container = document.querySelector('.scanner-container')
      if (container) {
        const div = document.createElement('div')
        div.id = 'qr-reader'
        div.style.width = '100%'
        div.style.maxWidth = '500px'
        container.insertBefore(div, container.firstChild)
        scannerElement = div
      }
    }

    scanner.value = new Html5Qrcode('qr-reader')

    await scanner.value.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        handleQRScan(decodedText)
      },
      (errorMessage) => {
        console.log(errorMessage)
        // Ignore scanning errors
      },
    )
  } catch (error) {
    console.error('Scanner error:', error)
    scanning.value = false
  }
}

const stopScanner = () => {
  if (scanner.value) {
    scanner.value
      .stop()
      .then(() => {
        scanning.value = false
        scanner.value = null
      })
      .catch((err) => {
        console.error('Stop scanner error:', err)
        scanning.value = false
      })
  }
}

const handleQRScan = async (qrCode) => {
  if (scanner.value) {
    stopScanner()
  }

  try {
    const payload = {
      qr_code: qrCode,
      attendance_datetime: new Date().toISOString(),
    }

    const res = await api.post('/admin/attendance/qr-scan', payload)
    if (res.status === 201) {
      lastScanned.value = {
        student_name: res.data.data.enrollment?.student?.student_name,
        class_name: res.data.data.enrollment?.class?.class_name,
        attendance_datetime: new Date(res.data.data.attendance_datetime).toLocaleString(),
      }
      successMessage.value = 'Attendance marked successfully via QR scan'
      showSuccess.value = true
      await loadHistory()
    }
  } catch (error) {
    console.error('QR scan error:', error)
    if (error.response?.data?.message) {
      successMessage.value = error.response.data.message
      showSuccess.value = true
    }
  }
}

const loadHistory = async () => {
  try {
    loadingHistory.value = true
    const params = {}
    if (historyFilters.value.enrollment_id) {
      params.enrollment_id = historyFilters.value.enrollment_id
    }
    if (historyFilters.value.date_from) {
      params.date_from = historyFilters.value.date_from
    }
    if (historyFilters.value.date_to) {
      params.date_to = historyFilters.value.date_to
    }

    const res = await api.get('/admin/attendance', { params })
    if (res.status === 200 && res.data?.data) {
      attendanceHistory.value = res.data.data
    }
  } catch (error) {
    console.error('Load history error:', error)
  } finally {
    loadingHistory.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  successMessage.value = ''
  lastScanned.value = null
}

onMounted(() => {
  loadEnrollments()
  loadHistory()
})

onUnmounted(() => {
  if (scanner.value) {
    stopScanner()
  }
})
</script>

<style scoped>
.scanner-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#qr-reader {
  border-radius: 8px;
  overflow: hidden;
}

#qr-reader__dashboard_section {
  background: white;
  border-radius: 8px;
}

#qr-reader__camera_selection {
  margin: 10px 0;
}
</style>
