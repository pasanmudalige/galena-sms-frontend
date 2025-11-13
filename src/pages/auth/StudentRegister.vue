<template>
  <q-page class="flex flex-center bg-grey-1 q-pa-md">
    <div class="full-width" style="max-width: 700px">
      <!-- Logo - Outside card, top center -->
      <div class="flex flex-center q-mb-lg">
        <img src="~assets/galena.png" alt="Galena Logo" style="max-width: 220px; height: auto" />
      </div>

      <q-card class="rounded-xl shadow-lg">
        <!-- Header with prominent title -->
        <q-card-section class="bg-primary text-white text-center q-pa-xl">
          <div class="text-h4 font-bold q-mb-none">Student Registration</div>
          <div class="text-subtitle1 q-mt-sm opacity-90">Join our educational community</div>
        </q-card-section>

        <q-separator />

        <!-- Form Section -->
        <q-card-section>
          <q-form @submit.prevent="submitRegistration">
            <div class="q-gutter-md">
              <!-- Full Name -->
              <q-input
                v-model="form.student_name"
                label="Full Name *"
                outlined
                :rules="[(v) => !!v || 'Required']"
              />

              <!-- Phone (WhatsApp) with hint -->
              <q-input
                v-model="form.phone"
                label="Phone (WhatsApp) *"
                outlined
                :rules="[(v) => !!v || 'Required']"
              >
                <template #hint>
                  <div class="text-caption text-grey-7 q-mt-xs">
                    We’ll send your login details to this WhatsApp number.
                  </div>
                </template>
              </q-input>

              <!-- Email -->
              <q-input
                v-model="form.email"
                label="Email *"
                outlined
                type="email"
                :rules="[(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'Invalid email']"
              />

              <!-- Parent Phone -->
              <q-input
                v-model="form.parent_phone"
                label="Parent Phone *"
                outlined
                :rules="[(v) => !!v || 'Required']"
              />

              <!-- School -->
              <q-input v-model="form.school" label="School" outlined />

              <!-- Year of A/L -->
              <q-select
                v-model="form.year_of_al"
                label="Year of A/L *"
                outlined
                :options="alYears"
                emit-value
                map-options
                clearable
                :rules="[(v) => !!v || 'Required']"
              />

              <!-- Address -->
              <q-input
                v-model="form.address"
                label="Address"
                outlined
                type="textarea"
                autogrow
                rows="3"
              />

              <!-- Where did you hear about us? -->
              <div>
                <div class="text-body2 text-grey-8 font-medium q-mb-sm">
                  Where did you hear about us?
                </div>
                <div class="row q-gutter-sm">
                  <div
                    v-for="option in hearAboutUsOptions"
                    :key="option.value"
                    class="col-12 col-sm-6"
                  >
                    <q-checkbox
                      :val="option.value"
                      v-model="form.hear_about_us"
                      :label="option.label"
                      color="primary"
                      class="q-pa-sm bg-grey-2 rounded-borders"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-center q-mt-xl">
              <q-btn
                color="primary"
                no-caps
                label="Register"
                type="submit"
                :loading="submitting"
                size="lg"
                class="q-px-xl"
                style="min-width: 200px"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

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
import { showErrorNotification } from 'src/utils/notification'

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
      showErrorNotification(error.response.data.message)
    } else {
      showErrorNotification('Registration failed. Please try again.')
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
