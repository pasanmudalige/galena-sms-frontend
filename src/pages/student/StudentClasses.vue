<template>
  <q-page class="p-6">
    <div class="text-2xl font-semibold mb-6">My Classes</div>

    <q-table :rows="classRows" :columns="columns" row-key="id" flat bordered>
      <template #body-cell-qr_code="props">
        <q-td :props="props">
          <q-btn
            v-if="props.row.enrollment_id"
            flat
            dense
            round
            icon="qr_code"
            color="primary"
            @click="showQRCode(props.row.enrollment_id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showQRDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-center">
            <q-img :src="qrCodeUrl" style="max-width: 300px" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth-store'

defineOptions({
  name: 'StudentClasses',
})

const authStore = useAuthStore()
const authUser = ref(null)
const classRows = ref([])
const showQRDialog = ref(false)
const qrCodeUrl = ref('')

const columns = [
  { name: 'class_name', label: 'Class Name', field: 'class_name', align: 'left', sortable: true },
  { name: 'subject', label: 'Subject', field: 'subject', align: 'left' },
  { name: 'enrolled_date', label: 'Enrolled Date', field: 'enrolled_date', align: 'left' },
  { name: 'qr_code', label: 'QR Code', field: 'qr_code', align: 'center' },
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
  try {
    const studentsRes = await api.get('/admin/students')
    if (studentsRes.status === 200 && studentsRes.data?.data) {
      const student = studentsRes.data.data.find((s) => s.email === authUser.value?.email)
      if (student) {
        const enrollmentsRes = await api.get('/admin/enrollments')
        if (enrollmentsRes.status === 200 && enrollmentsRes.data?.data) {
          const studentEnrollments = enrollmentsRes.data.data.filter(
            (e) => e.student?.id === student.id
          )

          classRows.value = studentEnrollments.map((e) => ({
            id: e.id,
            class_name: e.class?.class_name || 'N/A',
            subject: e.class?.class_code || 'N/A',
            enrolled_date: new Date(e.enrollment_date).toLocaleDateString(),
            qr_code: e.enrollment_qr_code,
            enrollment_id: e.id,
          }))
        }
      }
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const showQRCode = async (enrollmentId) => {
  try {
    // Get QR code image from enrollment
    const res = await api.get(`/admin/enrollments/${enrollmentId}`)
    if (res.status === 200 && res.data?.data?.qr_code_image) {
      qrCodeUrl.value = res.data.data.qr_code_image
      showQRDialog.value = true
    }
  } catch (error) {
    console.error('Error loading QR code:', error)
  }
}

onMounted(() => {
  loadUserData()
})
</script>

