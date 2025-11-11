<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="rounded-xl shadow-lg" style="min-width: 500px; max-width: 600px; width: 100%">
      <!-- Header -->
      <q-card-section class="bg-primary text-white text-lg font-semibold text-center rounded-t-xl">
        Student Registration
      </q-card-section>

      <q-separator />

      <!-- Form Section -->
      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="submitRegistration" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <q-input
              v-model="form.student_name"
              label="Full Name *"
              dense
              outlined
              :rules="[(v) => !!v || 'Required']"
            />
            <q-input
              v-model="form.phone"
              label="Phone (WhatsApp) *"
              dense
              outlined
              :rules="[(v) => !!v || 'Required']"
            />
            <q-input
              v-model="form.email"
              label="Email *"
              dense
              outlined
              type="email"
              :rules="[(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'Invalid email']"
            />
            <q-input v-model="form.parent_phone" label="Parent Phone" dense outlined />
            <q-input v-model="form.school" label="School" dense outlined />
            <q-select
              v-model="form.year_of_al"
              label="Year of A/L"
              dense
              outlined
              :options="alYears"
              emit-value
              map-options
              clearable
            />
            <q-input
              v-model="form.address"
              label="Address"
              dense
              outlined
              type="textarea"
              autogrow
              class="md:col-span-2"
            />
            <div class="md:col-span-2">
              <div class="text-sm text-grey-8 font-medium mb-2">Where did you hear about us?</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="option in hearAboutUsOptions"
                  :key="option.value"
                  class="bg-white rounded-lg p-2 shadow-sm"
                >
                  <q-checkbox
                    :val="option.value"
                    v-model="form.hear_about_us"
                    :label="option.label"
                    dense
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <q-btn
              color="primary"
              no-caps
              label="Register"
              type="submit"
              :loading="submitting"
              class="text-white shadow-md"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Success Dialog -->
    <q-dialog v-model="showSuccess" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-center">
          <q-icon name="check_circle" color="positive" size="64px" />
          <div class="text-xl font-semibold mt-2">Registration Successful!</div>
          <div class="text-grey-7 mt-2">
            Your registration has been submitted. Please wait for admin approval. You will receive
            your login credentials via WhatsApp once approved.
          </div>
          <div v-if="studentId" class="text-primary mt-2 font-mono">
            Student ID: {{ studentId }}
          </div>
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
import { useRouter } from 'vue-router'

defineOptions({
  name: 'StudentRegister',
})

const router = useRouter()
const submitting = ref(false)
const showSuccess = ref(false)
const studentId = ref('')
const alYears = ref([])

const form = ref({
  student_name: '',
  phone: '',
  email: '',
  parent_phone: '',
  school: '',
  year_of_al: '',
  address: '',
  hear_about_us: [],
})

const hearAboutUsOptions = [
  { label: 'From Poster', value: 'From Poster' },
  { label: 'From Facebook', value: 'From Facebook' },
  { label: 'From Instagram', value: 'From Instagram' },
  { label: 'From Leaflet', value: 'From Leaflet' },
  { label: 'A Friend Or Colleague', value: 'A Friend Or Colleague' },
]

const loadALYears = async () => {
  try {
    const res = await api.get('/common/constants/al-years')
    if (res.status === 200 && res.data?.data) {
      alYears.value = res.data.data.map((year) => ({ label: year, value: year }))
    }
  } catch (error) {
    console.log(error)
    // Fallback to hardcoded values
    alYears.value = ['2026', '2027', '2028', '2029', '2030'].map((year) => ({
      label: year,
      value: year,
    }))
  }
}

const submitRegistration = async () => {
  try {
    submitting.value = true
    const payload = { ...form.value }
    // Ensure hear_about_us is sent as array
    if (!Array.isArray(payload.hear_about_us)) {
      payload.hear_about_us = payload.hear_about_us ? [payload.hear_about_us] : []
    }
    const res = await api.post('/common/student/register', payload)
    if (res.status === 201) {
      studentId.value = res.data?.data?.student_id || ''
      showSuccess.value = true
    }
  } catch (error) {
    console.error('Registration error:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('Registration failed. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  router.push('/')
}

onMounted(() => {
  loadALYears()
})
</script>
