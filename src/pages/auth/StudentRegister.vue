<template>
  <q-page class="registration-page">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <header class="registration-header">
      <router-link to="/" class="brand-link" aria-label="Back to Galena home">
        <img src="~assets/galena.png" alt="Galena" class="brand-logo" />
      </router-link>
      <q-btn flat no-caps icon="arrow_back" label="Back to home" to="/" class="back-btn" />
    </header>

    <main class="registration-shell">
      <section class="welcome-panel">
        <div class="welcome-image-wrap">
          <img
            src="~assets/galena-student-study.webp"
            alt="Students learning science together"
            class="welcome-image"
          />
          <div class="image-overlay"></div>
          <div class="image-label"><q-icon name="science" /> A/L Science Community</div>
        </div>

        <div class="welcome-copy">
          <div class="eyebrow"><q-icon name="auto_awesome" /> Your learning journey starts here</div>
          <h1>Learn with purpose.<br /><span>Grow with Galena.</span></h1>
          <p>
            Create your student profile and take the first step towards focused learning, expert
            guidance, and measurable progress.
          </p>

          <div class="benefit-list">
            <div class="benefit-item">
              <span class="benefit-icon blue"><q-icon name="school" /></span>
              <div><strong>Expert-led classes</strong><small>Clear lessons built for A/L success</small></div>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon violet"><q-icon name="insights" /></span>
              <div><strong>Track your progress</strong><small>Classes, attendance, payments and resources</small></div>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon amber"><q-icon name="groups" /></span>
              <div><strong>Student-first support</strong><small>A connected community that helps you grow</small></div>
            </div>
          </div>
        </div>
      </section>

      <q-card flat class="form-card">
        <q-card-section class="form-heading">
          <div class="step-pill"><span>1</span> Student application</div>
          <h2>Create your account</h2>
          <p>Tell us a little about yourself. It only takes a few minutes.</p>
        </q-card-section>

        <q-card-section class="form-body">
          <q-form @submit.prevent="submitRegistration">
            <div class="section-label"><q-icon name="person_outline" /> Student details</div>
            <div class="form-grid">
              <q-input
                v-model="form.student_name"
                label="Full name *"
                outlined
                class="field full-field"
                hide-bottom-space
                :rules="[(v) => !!v || 'Required']"
              >
                <template #prepend><q-icon name="badge" /></template>
              </q-input>

              <q-input
                v-model="form.phone"
                label="WhatsApp number *"
                outlined
                class="field"
                hide-bottom-space
                :rules="[(v) => !!v || 'Required']"
              >
                <template #prepend><q-icon name="chat_bubble_outline" /></template>
              </q-input>

              <q-input
                v-model="form.email"
                label="Email address *"
                outlined
                type="email"
                class="field"
                hide-bottom-space
                :rules="[(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'Invalid email']"
              >
                <template #prepend><q-icon name="mail_outline" /></template>
              </q-input>

              <div class="whatsapp-note full-field">
                <q-icon name="info" /> We’ll send your login details to this WhatsApp number after approval.
              </div>

              <q-input
                v-model="form.parent_phone"
                label="Parent's phone *"
                outlined
                class="field"
                hide-bottom-space
                :rules="[(v) => !!v || 'Required']"
              >
                <template #prepend><q-icon name="phone_in_talk" /></template>
              </q-input>

              <q-select
                v-model="form.year_of_al"
                label="Year of A/L *"
                outlined
                class="field"
                :options="alYears"
                emit-value
                map-options
                clearable
                hide-bottom-space
                :rules="[(v) => !!v || 'Required']"
              >
                <template #prepend><q-icon name="event" /></template>
              </q-select>

              <q-input v-model="form.school" label="School" outlined class="field full-field" hide-bottom-space>
                <template #prepend><q-icon name="account_balance" /></template>
              </q-input>

              <q-input
                v-model="form.address"
                label="Address"
                outlined
                type="textarea"
                autogrow
                rows="2"
                class="field full-field"
                hide-bottom-space
              >
                <template #prepend><q-icon name="location_on" /></template>
              </q-input>
            </div>

            <div class="section-label discovery-label"><q-icon name="campaign" /> How did you find us?</div>
            <div class="option-grid">
              <q-checkbox
                v-for="option in hearAboutUsOptions"
                :key="option.value"
                v-model="form.hear_about_us"
                :val="option.value"
                :label="option.label"
                color="primary"
                class="discovery-option"
              />
            </div>

            <q-btn
              unelevated
              no-caps
              label="Submit application"
              icon-right="arrow_forward"
              type="submit"
              :loading="submitting"
              class="submit-btn full-width"
            />
            <p class="privacy-note"><q-icon name="lock" /> Your information is private and securely handled.</p>
          </q-form>
        </q-card-section>
      </q-card>
    </main>

    <q-dialog v-model="showSuccess" persistent>
      <q-card class="success-card">
        <q-card-section class="text-center q-pa-xl">
          <div class="success-icon"><q-icon name="check" /></div>
          <h3>Registration successful!</h3>
          <p>
            Your application has been submitted. You’ll receive your login credentials via
            WhatsApp after admin approval.
          </p>
          <div v-if="studentId" class="student-id">Student ID: {{ studentId }}</div>
          <q-btn unelevated no-caps label="Back to home" icon-right="arrow_forward" class="dialog-btn" @click="closeSuccess" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { showErrorNotification } from 'src/utils/notification'

defineOptions({ name: 'StudentRegister' })

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
  { label: 'Poster', value: 'From Poster' },
  { label: 'Facebook', value: 'From Facebook' },
  { label: 'Instagram', value: 'From Instagram' },
  { label: 'Leaflet', value: 'From Leaflet' },
  { label: 'Friend or colleague', value: 'A Friend Or Colleague' },
]

const loadALYears = async () => {
  try {
    const res = await api.get('/common/constants/al-years')
    if (res.status === 200 && res.data?.data) {
      alYears.value = res.data.data.map((year) => ({ label: year, value: year }))
    }
  } catch (error) {
    console.log(error)
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

onMounted(loadALYears)
</script>

<style scoped>
.registration-page {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  color: #102554;
  background: linear-gradient(145deg, #f7faff 0%, #effaff 48%, #f8f5ff 100%);
  font-family: Inter, "Segoe UI", sans-serif;
}

.ambient { position: absolute; border-radius: 50%; filter: blur(8px); pointer-events: none; }
.ambient-one { width: 420px; height: 420px; top: -190px; left: -150px; background: rgba(39, 198, 239, .16); }
.ambient-two { width: 480px; height: 480px; right: -210px; bottom: -170px; background: rgba(128, 77, 244, .13); }

.registration-header {
  position: relative;
  z-index: 2;
  max-width: 1240px;
  height: 86px;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo { width: 112px; display: block; }
.brand-link { display: inline-flex; }
.back-btn { color: #24385f; font-weight: 700; border-radius: 12px; }

.registration-shell {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 48px));
  margin: 18px auto 70px;
  display: grid;
  grid-template-columns: .92fr 1.08fr;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(26, 50, 102, .14);
}

.welcome-panel {
  padding: 34px;
  background: linear-gradient(155deg, #0c2556 0%, #173b86 57%, #5632bc 100%);
  color: white;
}

.welcome-image-wrap { height: 270px; border-radius: 22px; overflow: hidden; position: relative; }
.welcome-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.image-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 42%, rgba(5, 20, 52, .72)); }
.image-label {
  position: absolute;
  left: 18px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba(255,255,255,.32);
  border-radius: 99px;
  background: rgba(10, 31, 72, .7);
  backdrop-filter: blur(8px);
  font-weight: 700;
  font-size: 13px;
}

.welcome-copy { padding: 34px 8px 10px; }
.eyebrow { color: #79ddff; text-transform: uppercase; letter-spacing: .1em; font-weight: 800; font-size: 12px; }
.eyebrow .q-icon { margin-right: 5px; }
.welcome-copy h1 { margin: 16px 0; font-size: clamp(34px, 3.2vw, 49px); line-height: 1.08; letter-spacing: -.04em; font-weight: 850; }
.welcome-copy h1 span { color: #71e2ff; }
.welcome-copy > p { margin: 0; max-width: 440px; color: rgba(255,255,255,.74); line-height: 1.72; font-size: 15px; }
.benefit-list { display: grid; gap: 17px; margin-top: 30px; }
.benefit-item { display: flex; align-items: center; gap: 13px; }
.benefit-item div { display: grid; gap: 2px; }
.benefit-item strong { font-size: 14px; }
.benefit-item small { color: rgba(255,255,255,.62); font-size: 12px; }
.benefit-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; font-size: 19px; }
.benefit-icon.blue { background: rgba(52, 207, 250, .18); color: #72e5ff; }
.benefit-icon.violet { background: rgba(175, 126, 255, .22); color: #cfadff; }
.benefit-icon.amber { background: rgba(255, 190, 58, .2); color: #ffd16f; }

.form-card { border-radius: 0; background: rgba(255,255,255,.97); }
.form-heading { padding: 44px 46px 22px; }
.step-pill { display: inline-flex; align-items: center; gap: 8px; color: #3b63dd; font-weight: 750; font-size: 12px; text-transform: uppercase; letter-spacing: .07em; }
.step-pill span { width: 24px; height: 24px; display: grid; place-items: center; color: white; background: linear-gradient(135deg, #286cec, #7b3ff2); border-radius: 50%; }
.form-heading h2 { margin: 14px 0 7px; font-size: 32px; line-height: 1.15; letter-spacing: -.03em; color: #102554; }
.form-heading p { margin: 0; color: #70809f; }
.form-body { padding: 14px 46px 38px; }
.section-label { display: flex; align-items: center; gap: 8px; margin: 6px 0 15px; font-size: 13px; color: #425679; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
.section-label .q-icon { color: #4d6fe7; font-size: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.full-field { grid-column: 1 / -1; }
.field :deep(.q-field__control) { border-radius: 13px; background: #fbfcff; min-height: 56px; }
.field :deep(.q-field__prepend) { color: #7890bc; }
.field :deep(.q-field--focused .q-field__control) { background: white; }
.whatsapp-note { margin-top: -7px; display: flex; align-items: center; gap: 7px; color: #5d739c; font-size: 12px; }
.whatsapp-note .q-icon { color: #1cad73; }
.discovery-label { margin-top: 28px; }
.option-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; }
.discovery-option { min-height: 43px; padding: 3px 10px; border: 1px solid #e2e8f5; border-radius: 11px; background: #f8faff; color: #405477; }
.submit-btn { margin-top: 28px; min-height: 54px; border-radius: 14px; background: linear-gradient(110deg, #226eea, #6744ed 68%, #9e36e8); color: white; font-size: 15px; font-weight: 800; box-shadow: 0 13px 28px rgba(77, 74, 224, .25); }
.privacy-note { margin: 15px 0 0; text-align: center; color: #8a99b4; font-size: 12px; }
.privacy-note .q-icon { margin-right: 3px; color: #55a883; }

.success-card { width: min(440px, calc(100vw - 32px)); border-radius: 24px; }
.success-icon { width: 76px; height: 76px; display: grid; place-items: center; margin: 0 auto 18px; border-radius: 50%; color: white; background: linear-gradient(135deg, #14bd87, #4bd7a5); font-size: 42px; box-shadow: 0 12px 26px rgba(20, 189, 135, .25); }
.success-card h3 { margin: 0 0 10px; color: #102554; font-size: 25px; }
.success-card p { color: #6f809e; line-height: 1.6; }
.student-id { margin: 15px 0; padding: 10px; color: #3f58c8; background: #f1f4ff; border-radius: 10px; font-weight: 750; }
.dialog-btn { margin-top: 10px; min-height: 45px; padding: 0 24px; color: white; background: linear-gradient(110deg, #226eea, #7341ec); border-radius: 12px; font-weight: 750; }

@media (max-width: 900px) {
  .registration-shell { grid-template-columns: 1fr; width: min(680px, calc(100% - 32px)); }
  .welcome-panel { display: grid; grid-template-columns: .85fr 1.15fr; gap: 24px; padding: 26px; }
  .welcome-image-wrap { height: 100%; min-height: 300px; }
  .welcome-copy { padding: 14px 0; }
  .welcome-copy h1 { font-size: 35px; }
  .benefit-list { margin-top: 23px; }
}

@media (max-width: 600px) {
  .registration-header { height: 72px; padding: 0 18px; }
  .brand-logo { width: 88px; }
  .back-btn :deep(.q-btn__content) { font-size: 0; }
  .back-btn :deep(.q-icon) { font-size: 22px; }
  .registration-shell { width: calc(100% - 20px); margin: 8px auto 34px; border-radius: 22px; }
  .welcome-panel { display: block; padding: 16px 16px 28px; }
  .welcome-image-wrap { height: 210px; min-height: 0; }
  .welcome-copy { padding: 25px 7px 0; }
  .welcome-copy h1 { font-size: 34px; }
  .welcome-copy > p { font-size: 14px; }
  .benefit-list { display: none; }
  .form-heading { padding: 32px 23px 18px; }
  .form-heading h2 { font-size: 28px; }
  .form-body { padding: 12px 23px 30px; }
  .form-grid, .option-grid { grid-template-columns: 1fr; }
  .full-field { grid-column: auto; }
  .whatsapp-note { margin-top: -5px; }
  .discovery-option { min-height: 40px; }
}
</style>
