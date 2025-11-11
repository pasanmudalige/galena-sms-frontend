<template>
  <q-page class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-semibold">Student Enrollment</div>
      <q-btn no-caps color="primary" icon="add" label="Enroll Student" @click="showEnroll = true" />
    </div>

    <q-table :rows="rows" :columns="columns" row-key="id" flat bordered>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            flat
            round
            icon="qr_code"
            color="primary"
            class="mr-1"
            @click="viewQR(props.row)"
          />
          <q-btn
            dense
            flat
            round
            icon="edit"
            color="orange"
            class="mr-1"
            @click="onEdit(props.row)"
          />
          <q-btn dense flat round icon="delete" color="negative" @click="onDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Enroll Student Dialog -->
    <q-dialog v-model="showEnroll" persistent>
      <q-card style="min-width: 520px">
        <q-card-section class="text-lg font-semibold">Enroll Student to Class</q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitEnroll">
            <q-select
              v-model="form.student_id"
              label="Student"
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
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No results</q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              v-model="form.class_id"
              label="Class"
              dense
              outlined
              :options="classOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              :rules="[(v) => !!v || 'Required']"
              class="q-mt-md"
            />

            <q-input
              v-model="form.enrollment_date"
              label="Enrollment Date"
              dense
              outlined
              type="date"
              :rules="[(v) => !!v || 'Required']"
              class="q-mt-md"
            />

            <q-select
              v-model="form.card_type"
              label="Card Type"
              dense
              outlined
              :options="cardTypeOptions"
              class="q-mt-md"
            />

            <q-input
              v-model.number="form.custom_fee"
              label="Custom Fee (optional)"
              dense
              outlined
              type="number"
              step="0.01"
              class="q-mt-md"
            />

            <div class="flex justify-end gap-2 mt-4">
              <q-btn flat no-caps label="Cancel" v-close-popup />
              <q-btn color="primary" no-caps label="Enroll" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- QR Code Display Dialog -->
    <q-dialog v-model="showQR" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-lg font-semibold">Enrollment QR Code</q-card-section>
        <q-separator />
        <q-card-section class="text-center">
          <div v-if="qrCodeImage" class="q-mb-md">
            <img :src="qrCodeImage" alt="QR Code" style="max-width: 300px; width: 100%" />
          </div>
          <div v-if="qrCodeString" class="q-mt-md">
            <div class="text-caption text-grey-7">QR Code String:</div>
            <div class="text-body2 font-mono q-mt-xs">{{ qrCodeString }}</div>
          </div>
          <div v-if="enrollmentDetails" class="q-mt-md text-left">
            <div class="text-subtitle2 q-mb-xs">
              <strong>Student:</strong> {{ enrollmentDetails.student?.student_name }}
            </div>
            <div class="text-subtitle2 q-mb-xs">
              <strong>Class:</strong> {{ enrollmentDetails.class?.class_name }}
            </div>
            <div class="text-subtitle2">
              <strong>Enrollment Date:</strong> {{ enrollmentDetails.enrollment_date }}
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" no-caps label="Close" @click="showQR = false" />
          <q-btn
            color="secondary"
            no-caps
            label="Download QR"
            icon="download"
            @click="downloadQR"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

const rows = ref([])
const showEnroll = ref(false)
const showQR = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const saving = ref(false)
const qrCodeImage = ref('')
const qrCodeString = ref('')
const enrollmentDetails = ref(null)
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
  { name: 'student', label: 'Student', field: 'student', align: 'left', format: (val, row) => row.student?.student_name || '-' },
  { name: 'student_id', label: 'Student ID', field: 'student_id', align: 'left', format: (val, row) => row.student?.student_id || '-' },
  { name: 'class', label: 'Class', field: 'class', align: 'left', format: (val, row) => row.class?.class_name || '-' },
  { name: 'enrollment_date', label: 'Enrollment Date', field: 'enrollment_date', align: 'left', sortable: true },
  { name: 'card_type', label: 'Card Type', field: 'card_type', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const loadEnrollments = async () => {
  const res = await api.get('/admin/enrollments')
  if (res.status === 200 && res.data?.data) {
    rows.value = res.data.data
  }
}

const loadStudents = async () => {
  const res = await api.get('/admin/students')
  if (res.status === 200 && res.data?.data) {
    students.value = res.data.data
    allStudents.value = res.data.data
    studentOptions.value = res.data.data.map((s) => ({
      label: `${s.student_name} (${s.student_id || 'N/A'})`,
      value: s.id,
    }))
  }
}

const loadClasses = async () => {
  const res = await api.get('/admin/classes')
  if (res.status === 200 && res.data?.data) {
    classes.value = res.data.data
    classOptions.value = res.data.data
      .filter((c) => c.status === 'active')
      .map((c) => ({
        label: `${c.class_name} (${c.class_code || 'N/A'})`,
        value: c.id,
      }))
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
    }
  } catch (error) {
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
    console.error('Error loading QR:', error)
  }
}

const downloadQR = () => {
  if (qrCodeImage.value) {
    const link = document.createElement('a')
    link.href = qrCodeImage.value
    link.download = `enrollment-qr-${qrCodeString.value}.png`
    link.click()
  }
}

const onEdit = (row) => {
  // TODO: Implement edit functionality
  console.log('Edit enrollment:', row)
}

const onDelete = async (row) => {
  if (confirm('Are you sure you want to delete this enrollment?')) {
    await api.delete(`/admin/enrollments/${row.id}`)
    await loadEnrollments()
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


