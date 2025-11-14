<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-subtitle2 text-grey-6">Manage student class enrollments</div>
        </div>
        <div class="col-auto">
          <q-btn
            no-caps
            color="primary"
            icon="add"
            label="Enroll Student"
            unelevated
            @click="showEnroll = true"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Total Enrollments</div>
                  <div class="text-h4 text-weight-bold text-primary q-mt-xs">
                    {{ rows.length }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="blue-1" text-color="primary">
                    <q-icon name="person_add" size="32px" />
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
                  <div class="text-overline text-grey-7">Active Enrollments</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">
                    {{ activeEnrollmentsCount }}
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

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-orange">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Full Cards</div>
                  <div class="text-h4 text-weight-bold text-warning q-mt-xs">
                    {{ fullCardCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="orange-1" text-color="warning">
                    <q-icon name="credit_card" size="32px" />
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
                  <div class="text-overline text-grey-7">Half Cards</div>
                  <div class="text-h4 text-weight-bold text-purple q-mt-xs">
                    {{ halfCardCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="purple-1" text-color="purple">
                    <q-icon name="card_membership" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Enrollments Table -->
      <q-card flat bordered>
        <q-card-section class="q-pa-md">
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            :rows-per-page-options="[10, 20, 50, 100]"
            class="enrollments-table"
          >
            <template #top>
              <div class="text-h6 text-weight-bold text-grey-8">Enrollments List</div>
            </template>

            <template #body-cell-student="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-avatar size="32px" color="primary" text-color="white" class="q-mr-sm">
                    <q-icon name="person" />
                  </q-avatar>
                  <div>
                    <div class="text-weight-medium">
                      {{ props.row.student?.student_name || '-' }}
                    </div>
                    <div class="text-caption text-grey-6">
                      ID: {{ props.row.student?.student_id || 'N/A' }}
                    </div>
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-class="props">
              <q-td :props="props">
                <q-chip size="sm" color="info" text-color="white" icon="school">
                  {{ props.row.class?.class_name || '-' }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-card_type="props">
              <q-td :props="props">
                <q-chip
                  size="sm"
                  :color="getCardTypeColor(props.value)"
                  text-color="white"
                  :icon="getCardTypeIcon(props.value)"
                >
                  {{ formatCardType(props.value) }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="props.value === 'active' ? 'positive' : 'negative'"
                  text-color="white"
                  :icon="props.value === 'active' ? 'check_circle' : 'block'"
                  size="sm"
                >
                  {{ props.value || 'active' }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  round
                  icon="qr_code_scanner"
                  color="primary"
                  class="q-mr-xs"
                  @click="viewQR(props.row)"
                  title="View QR Code"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="edit"
                  color="orange"
                  class="q-mr-xs"
                  @click="onEdit(props.row)"
                  title="Edit Enrollment"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="onDelete(props.row)"
                  title="Delete Enrollment"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Enroll Student Dialog -->
      <q-dialog v-model="showEnroll" persistent>
        <q-card class="rounded-xl shadow-lg" style="min-width: 540px; max-width: 600px">
          <q-card-section
            class="bg-primary text-white text-lg font-semibold flex items-center justify-between rounded-t-xl"
          >
            <div>Enroll Student to Class</div>
            <q-btn flat dense round icon="close" color="white" v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-lg bg-grey-1">
            <q-form @submit.prevent="submitEnroll" class="q-gutter-md">
              <q-select
                v-model="form.student_id"
                label="Student *"
                dense
                outlined
                :options="studentOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                :rules="[(v) => !!v || 'Required']"
                use-input
                input-debounce="0"
                @filter="filterStudents"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">No results</q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select
                v-model="form.class_id"
                label="Class *"
                dense
                outlined
                :options="classOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                :rules="[(v) => !!v || 'Required']"
              />

              <q-input
                v-model="form.enrollment_date"
                label="Enrollment Date *"
                dense
                outlined
                type="date"
                :rules="[(v) => !!v || 'Required']"
              />

              <q-select
                v-model="form.card_type"
                label="Card Type"
                dense
                outlined
                :options="cardTypeOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
              />

              <q-input
                v-model.number="form.custom_fee"
                label="Custom Fee (optional)"
                dense
                outlined
                type="number"
                step="0.01"
                prefix="Rs "
                hint="Leave empty to use class default fee"
              />

              <div class="flex justify-end q-gutter-sm q-mt-lg">
                <q-btn flat no-caps label="Cancel" color="grey-7" v-close-popup />
                <q-btn
                  color="primary"
                  no-caps
                  label="Enroll"
                  type="submit"
                  :loading="saving"
                  unelevated
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- QR Code Display Dialog -->
      <q-dialog v-model="showQR" persistent>
        <q-card class="rounded-xl shadow-lg" style="min-width: 400px; max-width: 500px">
          <q-card-section
            class="bg-primary text-white text-lg font-semibold flex items-center justify-between rounded-t-xl"
          >
            <div>Enrollment QR Code</div>
            <q-btn flat dense round icon="close" color="white" v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-lg text-center">
            <div v-if="qrCodeImage" class="q-mb-md">
              <q-img :src="qrCodeImage" alt="QR Code" style="max-width: 300px; width: 100%" />
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
                <q-icon name="person" size="16px" class="q-mr-xs" />
                <strong>Student:</strong> {{ enrollmentDetails.student?.student_name }}
              </div>
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
              :disable="!qrCodeImage"
            />
            <q-btn flat no-caps label="Close" color="grey-7" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Success Dialog -->
      <q-dialog v-model="showSuccess">
        <q-card class="rounded-xl" style="min-width: 420px">
          <q-card-section class="text-center q-pa-lg">
            <q-icon name="check_circle" color="positive" size="64px" />
            <div class="text-h6 text-weight-bold q-mt-md">{{ successMessage }}</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pb-lg">
            <q-btn color="primary" no-caps label="OK" unelevated @click="closeSuccess" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Confirmation Dialog -->
      <q-dialog v-model="showDeleteConfirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="negative" text-color="white" />
            <span class="q-ml-sm text-h6">Confirm Delete</span>
          </q-card-section>
          <q-card-section>
            Are you sure you want to delete this enrollment?
            <br />
            <span class="text-caption text-grey-6">This action cannot be undone.</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Delete" color="negative" @click="confirmDelete" :loading="deleting" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { api } from 'src/boot/axios'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'
const rows = ref([])
const loading = ref(false)
const showEnroll = ref(false)
const showQR = ref(false)
const showSuccess = ref(false)
const showDeleteConfirm = ref(false)
const successMessage = ref('')
const saving = ref(false)
const deleting = ref(false)
const qrCodeImage = ref('')
const qrCodeString = ref('')
const enrollmentDetails = ref(null)
const enrollmentToDelete = ref(null)
const students = ref([])
const classes = ref([])
const studentOptions = ref([])
const allStudents = ref([])
const classOptions = ref([])

const form = ref({
  student_id: null,
  class_id: null,
  enrollment_date: new Date().toISOString().split('T')[0],
  card_type: 'full_card',
  custom_fee: null,
})

const cardTypeOptions = [
  { label: 'Full Card', value: 'full_card' },
  { label: 'Half Card', value: 'half_card' },
  { label: 'Free Card', value: 'free_card' },
]

const columns = [
  {
    name: 'student',
    label: 'Student',
    field: 'student',
    align: 'left',
    format: (val, row) => row.student?.student_name || '-',
  },
  {
    name: 'student_id',
    label: 'Student ID',
    field: 'student_id',
    align: 'left',
    format: (val, row) => row.student?.student_id || '-',
  },
  {
    name: 'class',
    label: 'Class',
    field: 'class',
    align: 'left',
    format: (val, row) => row.class?.class_name || '-',
  },
  {
    name: 'enrollment_date',
    label: 'Enrollment Date',
    field: 'enrollment_date',
    align: 'left',
    sortable: true,
  },
  { name: 'card_type', label: 'Card Type', field: 'card_type', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const activeEnrollmentsCount = computed(() => {
  return rows.value.filter((r) => r.status === 'active').length
})

const fullCardCount = computed(() => {
  return rows.value.filter((r) => r.card_type === 'full_card').length
})

const halfCardCount = computed(() => {
  return rows.value.filter((r) => r.card_type === 'half_card').length
})

const formatCardType = (type) => {
  const types = {
    full_card: 'Full Card',
    half_card: 'Half Card',
    free_card: 'Free Card',
  }
  return types[type] || type
}

const getCardTypeColor = (type) => {
  const colors = {
    full_card: 'positive',
    half_card: 'warning',
    free_card: 'info',
  }
  return colors[type] || 'grey'
}

const getCardTypeIcon = (type) => {
  const icons = {
    full_card: 'credit_card',
    half_card: 'card_membership',
    free_card: 'card_giftcard',
  }
  return icons[type] || 'credit_card'
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

const loadEnrollments = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/enrollments')
    if (res.status === 200 && res.data?.data) {
      rows.value = res.data.data
    }
  } catch (error) {
    showErrorNotification('Failed to load enrollments')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadStudents = async () => {
  try {
    const res = await api.get('/admin/students')
    if (res.status === 200 && res.data?.data) {
      students.value = res.data.data
      allStudents.value = res.data.data
      studentOptions.value = res.data.data.map((s) => ({
        label: `${s.student_name} (${s.student_id || 'N/A'})`,
        value: s.id,
      }))
    }
  } catch (error) {
    console.error('Error loading students:', error)
  }
}

const loadClasses = async () => {
  try {
    const res = await api.get('/admin/classes')
    if (res.status === 200 && res.data?.data) {
      classes.value = res.data.data
      classOptions.value = res.data.data
        .filter((c) => c.status === 'active')
        .map((c) => ({
          label: `${c.class_name}${c.class_code ? ` (${c.class_code})` : ''}`,
          value: c.id,
        }))
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const filterStudents = (val, update) => {
  if (val === '') {
    update(() => {
      studentOptions.value = allStudents.value.map((s) => ({
        label: `${s.student_name} (${s.student_id || 'N/A'})`,
        value: s.id,
      }))
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    studentOptions.value = allStudents.value
      .filter((s) => {
        const name = s.student_name?.toLowerCase() || ''
        const id = s.student_id?.toLowerCase() || ''
        return name.includes(needle) || id.includes(needle)
      })
      .map((s) => ({
        label: `${s.student_name} (${s.student_id || 'N/A'})`,
        value: s.id,
      }))
  })
}

const submitEnroll = async () => {
  try {
    saving.value = true
    const res = await api.post('/admin/enrollments', form.value)
    if (res.status === 201) {
      qrCodeImage.value = res.data.data.qr_code_image
      qrCodeString.value = res.data.data.qr_code_string
      enrollmentDetails.value = res.data.data.enrollment
      showEnroll.value = false
      showQR.value = true
      await loadEnrollments()
      showSuccessNotification('Student enrolled successfully')
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to enroll student'
    showErrorNotification(errorMessage)
    console.error('Enrollment error:', error)
  } finally {
    saving.value = false
  }
}

const viewQR = async (row) => {
  try {
    const res = await api.get(`/admin/enrollments/${row.id}`)
    if (res.status === 200 && res.data?.data) {
      qrCodeImage.value = res.data.data.qr_code_image
      qrCodeString.value = res.data.data.enrollment.enrollment_qr_code
      enrollmentDetails.value = res.data.data.enrollment
      showQR.value = true
    }
  } catch (error) {
    showErrorNotification('Failed to load QR code')
    console.error('Error loading QR:', error)
  }
}

const downloadQR = () => {
  if (qrCodeImage.value) {
    const link = document.createElement('a')
    link.href = qrCodeImage.value
    link.download = `enrollment-qr-${qrCodeString.value || 'code'}.png`
    link.click()
    showSuccessNotification('QR code downloaded')
  }
}

const onEdit = (row) => {
  // TODO: Implement edit functionality
  showErrorNotification('Edit functionality coming soon')
  console.log('Edit enrollment:', row)
}

const onDelete = (row) => {
  enrollmentToDelete.value = row
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!enrollmentToDelete.value) return
  
  try {
    deleting.value = true
    await api.delete(`/admin/enrollments/${enrollmentToDelete.value.id}`)
    await loadEnrollments()
    showDeleteConfirm.value = false
    enrollmentToDelete.value = null
    showSuccessNotification('Enrollment deleted successfully')
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete enrollment'
    showErrorNotification(errorMessage)
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  successMessage.value = ''
}

onMounted(() => {
  loadEnrollments()
  loadStudents()
  loadClasses()
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

.enrollments-table :deep(.q-table__top) {
  padding: 16px;
}

.enrollments-table :deep(.q-table thead tr th) {
  background-color: #f5f5f5;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.enrollments-table :deep(.q-table tbody tr:hover) {
  background-color: #f9f9f9;
}
</style>
